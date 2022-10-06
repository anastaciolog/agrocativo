import { Express, NextFunction, Request, Response, Router } from "express"
import SessionDatabase from "../../rules/session/database/SessionDatabase"
import SessionDatabaseInterface from "../../rules/session/database/SessionDatabaseInterface"
import Session from "../../rules/session/models/Session"
import UserDatabase from "../../rules/user/database/UserDatabase"
import { UserDatabaseInterface } from "../../rules/user/database/UserDatabaseInterface"
import { User } from "../../rules/user/models/User"
import { confirmationCode, generateId } from "../../utils/idGenerator"
import { RouterInterface } from "../RouterInterface"
import { AuthenticationRouterInterace } from "./AuthenticationRouterInterface"
import { ValidatorRequest } from "../../utils/ValidatorRequest"
import ErrorResponse from "../../utils/ErrorResponse"
import bcrypt from "bcrypt"
import { sendResetPasswordEmail, sendWelcomeEmail, sendNewCode } from "../../services/Mailer"

export class AuthenticationRouter implements RouterInterface, AuthenticationRouterInterace {

	private router: Router
	private userDatabase: UserDatabaseInterface
	private sessionDatabase: SessionDatabaseInterface
	private validator: ValidatorRequest

	constructor(
		router: Router = Router(),
		userDatabase: UserDatabaseInterface = new UserDatabase(),
		sessionDatabase: SessionDatabaseInterface = new SessionDatabase(),
		validator = new ValidatorRequest()
	) {
		this.router = router
		this.userDatabase = userDatabase
		this.sessionDatabase = sessionDatabase
		this.validator = validator
	}

	public setupRoutes(server: Express): void {

		this.router.post("/login", (request: Request, response: Response, next: NextFunction) => {
			this.login(request, response, next)
		})
		this.router.get("/logout", (request: Request, response: Response, next: NextFunction) => {
			this.logout(request, response, next)
		})
		this.router.post("/register", (request: Request, response: Response, next: NextFunction) => {
			this.register(request, response, next)
		})
		this.router.get("/emailAvailability", (request: Request, response: Response, next: NextFunction) => {
			this.checkEmailAvailability(request, response, next)
		})
		this.router.post("/code", (request: Request, response: Response, next: NextFunction) => {
			this.sendCode(request, response, next)
		})
		this.router.post("/login/confirmed", (request: Request, response: Response, next: NextFunction) => {
			this.confirmedLogin(request, response, next)
		})
		this.router.put("/session", (request: Request, response: Response, next: NextFunction) => {
			this.updateSession(request, response, next)
		})
		this.router.post("/password/reset", (request: Request, response: Response, next: NextFunction) => {
			this.resetPassword(request, response, next)
		})
		this.router.post("/password/new", (request: Request, response: Response, next: NextFunction) => {
			this.newPassword(request, response, next)
		})
		server.use("/api/auth", this.router)
	}

	public async login(request: Request, response: Response, next: NextFunction): Promise<void> {

		const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress
		const email = request.body.email
		const code = request.body.code
		const platform = request.body.platform

		if (!this.validator.validateEmail(email)) {
			next(new ErrorResponse(3188, "Email inválido", 400))
			return
		}

		if (!this.validator.validatePlatform(platform)) {
			next(new ErrorResponse(3188, "Plataforma inválida", 400))
			return
		}

		if (code && code !== "" && !this.validator.validateCode(code)) {
			next(new ErrorResponse(3189, "Código inválido", 400))
			return
		}

		try {

			const user = await this.userDatabase.readUser(undefined, email)

			if (user instanceof Error) {
				next(new ErrorResponse(3111, user.message, 500))
				return
			}

			if (!user) {
				next(new ErrorResponse(3112, "Usuário não encontrado", 401))
				return
			}

			if (!user.confirmed && code === "") {
				next(new ErrorResponse(3119, "Conta desativada", 401))
				return
			}

			if (user.blocked) {
				next(new ErrorResponse(3120, "Conta bloqueada", 401))
				return
			}

			const match = await bcrypt.compare(request.body.password, user.password)

			if (!match) {
				next(new ErrorResponse(3113, "Senha incorreta", 401))
				return
			}

			//Activated account if not activate
			if (!user.confirmed && (code !== user.confirmation_code)) {
				next(new ErrorResponse(3134, "Código inválido", 400))
				return
			}

			if (!user.confirmed) {

				user.confirmed = true
				user.confirmation_code = confirmationCode()

				const activatedUser = await this.userDatabase.updateUser(user)

				if (activatedUser instanceof Error) {
					next(new ErrorResponse(3146, activatedUser.message, 400))
					return
				}
			}

			// Session Object
			const sessionModel = new Session(
				generateId(),
				user.id,
				await bcrypt.hash(user.id, 8),
				new Date(),
				new Date(),
				platform
			)

			await this.sessionDatabase.deleteUserSessions(user.id)

			const session = await this.sessionDatabase.createSession(sessionModel)

			if (session instanceof Error) {
				next(new ErrorResponse(3114, session.message, 500))
				return
			}

			delete user.password

			user.token = session.token

			console.log({ user: user })
			// Success
			response.json(user)

		} catch (error: any) {
			next(new ErrorResponse(3115, error.message, 500))
		}

	}

	public async logout(request: Request, response: Response, next: NextFunction): Promise<void> {

		const token = request.headers.token as string

		try {
			const session = await this.sessionDatabase.deleteSession(token)

			if (session instanceof Error) {
				next(new ErrorResponse(3116, session.message, 500))
				return
			}

			// Success
			response.status(204).json()

		} catch (error: any) {
			next(new ErrorResponse(3117, error.message, 500))
		}

	}

	public async sendCode(request: Request, response: Response, next: NextFunction): Promise<void> {

		const email = request.body.email
		const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

		if (!this.validator.validateEmail(email)) {
			next(new ErrorResponse(3188, "Email inválido", 400))
			return
		}

		try {

			const user = await this.userDatabase.readUser(undefined, email)

			if (user instanceof Error) {
				next(new ErrorResponse(3111, user.message, 500))
				return
			}

			if (!user) {
				next(new ErrorResponse(3112, "Usuário não encontrado", 401))
				return
			}

			if (user.confirmed) {
				next(new ErrorResponse(3119, "Sua conta já está ativa", 401))
				return
			}

			if (user.blocked) {
				next(new ErrorResponse(3120, "Conta bloqueada", 401))
				return
			}

			if (!user.confirmed) {

				user.confirmation_code = confirmationCode()

				const activatedUser = await this.userDatabase.updateUser(user)

				if (activatedUser instanceof Error) {
					next(new ErrorResponse(3146, activatedUser.message, 400))
					return
				}
			}

			const sendmail = await sendNewCode(user, ip)

			if (sendmail instanceof Error) {
				next(new ErrorResponse(3131, "Erro ao enviar email", 500))
				return
			}

			// Success
			response.json({
				message: "Enviamos ao seu email um código para ativar sua conta"
			})

		} catch (error: any) {
			next(new ErrorResponse(3117, error.message, 500))
		}

	}

	public async register(request: Request, response: Response, next: NextFunction): Promise<void> {

		const fullname = request.body.fullname
		const role = request.body.role
		const email = request.body.email
		const password = request.body.password


		if (!this.validator.validateName(fullname)) {
			next(new ErrorResponse(3116, "Nome inválido", 400))
			return
		}

		if (!this.validator.validateEmail(email)) {
			next(new ErrorResponse(3118, "Email inválido", 400))
			return
		}

		if (!this.validator.validatePassword(password)) {
			next(new ErrorResponse(3120, "Senha inválida", 400))
			return
		}

		if (!this.validator.validateRole(role)) {
			next(new ErrorResponse(3120, "Perfil de usuário inválido", 400))
			return
		}

		try {

			const verifyEmail = await this.userDatabase.readUser(undefined, email)

			if (verifyEmail instanceof Error) {
				next(new ErrorResponse(3121, verifyEmail.message, 500))
				return
			}

			if (verifyEmail) {
				next(new ErrorResponse(3122, "O email informado está em uso por outra conta", 500))
				return
			}

			const userModel = new User(
				fullname,
				role,
				email,
				await bcrypt.hash(password, 10),
				process.env.BASE_URL + 'public/image/user/empty-user.png'
			)

			const user = await this.userDatabase.createUser(userModel)

			if (user instanceof Error) {
				next(new ErrorResponse(3123, user.message, 500))
				return
			}

			// await this.login(request, response, next)

			const sendmail = await sendWelcomeEmail(user)

			if (sendmail instanceof Error) {
				next(new ErrorResponse(3131, "Erro ao enviar email", 500))
				return
			}

			response.json({
				message: "Parabéns! Sua conta foi criada com sucesso"
			})

		} catch (error: any) {
			next(new ErrorResponse(3124, error.message, 500))
		}
	}

	public async checkEmailAvailability(request: Request, response: Response, next: NextFunction): Promise<void> {

		const email = request.query.email

		try {
			const user = await this.userDatabase.readUser(undefined, email?.toString())

			if (user instanceof Error) {
				next(new ErrorResponse(3123, user.message, 500))
				return
			}

			// Success
			response.json({
				available: (user === undefined),
			})

		} catch (error: any) {
			next(new ErrorResponse(3124, error.message, 500))
		}
	}

	public async confirmedLogin(request: Request, response: Response, next: NextFunction): Promise<void> {

		const code = request.body.code
		const email = request.body.email

		if (!this.validator.validateEmail(email)) {
			next(new ErrorResponse(3188, "Email inválido", 400))
			return
		}
		if (!this.validator.validateCode(code)) {
			next(new ErrorResponse(3189, "Código inválido", 400))
			return
		}
		try {
			const user = await this.userDatabase.readUser(undefined, email, undefined, code)

			if (user instanceof Error) {
				next(new ErrorResponse(3146, user.message, 400))
				return
			}
			if (!user) {
				next(new ErrorResponse(3135, "Usuário não encontrado", 400))
				return
			}
			if (!user || (code !== user.confirmation_code)) {
				next(new ErrorResponse(3134, "Código inválido", 400))
				return
			}

			user.confirmed = true
			user.confirmation_code = confirmationCode()

			const activatedUser = await this.userDatabase.updateUser(user)

			if (activatedUser instanceof Error) {
				next(new ErrorResponse(3146, activatedUser.message, 400))
				return
			}
			// Successo
			response.json({
				message: "Parabéns! Sua conta foi validada com sucesso"
			})
		} catch (error: any) {
			next(new ErrorResponse(3127, error.message, 500))
		}
	}


	public async updateSession(request: Request, response: Response, next: NextFunction): Promise<void> {

		const session = response.locals.session as Session
		const platform = request.body.platform
		const deviceId = request.body.deviceId

		try {
			session.platform = platform
			session.deviceId = deviceId
			session.lastInteraction = new Date()
			const updatedSession = await this.sessionDatabase.updateSession(session)

			if (updatedSession instanceof Error) {
				await this.sessionDatabase.deleteSessionByDeviceId(deviceId)
				await this.updateSession(request, response, next)
				return
			}

			if (!updatedSession) {
				next(new ErrorResponse(3126, "Token inválido", 400))
				return
			}

			// Success
			response.json(updatedSession)

		} catch (error: any) {
			next(new ErrorResponse(3127, error.message, 500))
		}

	}

	public async resetPassword(request: Request, response: Response, next: NextFunction): Promise<void> {

		const email = request.body.email
		const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress

		if (!this.validator.validateEmail(email)) {
			next(new ErrorResponse(3188, "Email inválido", 400))
			return
		}

		try {
			const user = await this.userDatabase.readUser(undefined, email)

			if (user instanceof Error) {
				next(new ErrorResponse(3128, user.message, 500))
				return
			}
			if (!user) {
				next(new ErrorResponse(3129, "Usuário não encontrado", 400))
				return
			}
			user.confirmation_code = confirmationCode()
			const updatedUser = await this.userDatabase.updateUser(user)

			if (updatedUser instanceof Error) {
				next(new ErrorResponse(3130, updatedUser.message, 500))
				return
			}
			if (!updatedUser.confirmation_code) {
				next(new ErrorResponse(3131, "Erro ao gerar código de confirmação", 500))
				return
			}
			const sendmail = sendResetPasswordEmail(user, updatedUser.confirmation_code, ip)
			if (sendmail instanceof Error) {
				next(new ErrorResponse(3131, "Erro ao enviar email", 500))
				return
			}
			// Successo
			response.json({
				message: "Enviamos ao seu email instruções para redefinir sua senha"
			})

		} catch (error: any) {
			next(new ErrorResponse(3132, error.message, 500))
		}
	}

	public async newPassword(request: Request, response: Response, next: NextFunction): Promise<void> {

		const email = request.body.email
		const code = request.body.code
		const password = request.body.password

		if (!this.validator.validateEmail(email)) {
			next(new ErrorResponse(3188, "Email inválido", 400))
			return
		}
		if (!this.validator.validatePassword(password)) {
			next(new ErrorResponse(3120, "Senha inválida", 400))
			return
		}

		try {

			const user = await this.userDatabase.readUser(undefined, email, undefined, code)
			if (user instanceof Error) {
				next(new ErrorResponse(3133, user.message, 500))
				return
			}
			if (!user || (code !== user.confirmation_code)) {
				next(new ErrorResponse(3134, "Código expirado ou inválido", 400))
				return
			}

			user.password = await bcrypt.hash(password, 10)
			user.confirmation_code = confirmationCode()

			const updatedUser = await this.userDatabase.updateUser(user)
			if (updatedUser instanceof Error) {
				next(new ErrorResponse(3135, updatedUser.message, 500))
				return
			}
			// Successo
			response.json({
				message: "Senha alterada com sucesso. Faça login!"
			})

		} catch (error: any) {
			next(new ErrorResponse(3136, error.message, 500))
		}
	}
}

