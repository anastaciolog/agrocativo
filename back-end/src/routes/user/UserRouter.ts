import bcrypt from "bcrypt"
import fs from "fs"
import { Express, NextFunction, Request, Response, Router } from "express"
import UserDatabase from "../../rules/user/database/UserDatabase"
import { UserDatabaseInterface } from "../../rules/user/database/UserDatabaseInterface"
import { User } from "../../rules/user/models/User"
import { RouterInterface } from "../RouterInterface"
import UserRouterInterface from "./UserRouterInterface"
import { ValidatorRequest } from "../../utils/ValidatorRequest"
import ErrorResponse from "../../utils/ErrorResponse"
import { uploadImage } from "../../services/ImageUploader"
import { compressImage } from "../../services/CompressImage"

require('dotenv').config()

export class UserRouter implements RouterInterface, UserRouterInterface {

	private router: Router
	private userDatabase: UserDatabaseInterface
	private validator: ValidatorRequest

	constructor(
		router: Router = Router(),
		userDatabase: UserDatabaseInterface = new UserDatabase(),
		validator: ValidatorRequest = new ValidatorRequest()) {

		this.router = router
		this.userDatabase = userDatabase
		this.validator = validator
	}

	public setupRoutes(server: Express): void {
		this.router.get("/user/:id", (request: Request, response: Response, next: NextFunction) => {
			this.getUser(request, response, next)
		})
		this.router.get("/user/search/:search", (request: Request, response: Response, next: NextFunction) => {
			this.searchUser(request, response, next)
		})
		this.router.get("/user", (request: Request, response: Response, next: NextFunction) => {
			this.getCurrentUser(request, response, next)
		})
		this.router.put("/user", (request: Request, response: Response, next: NextFunction) => {
			this.putUser(request, response, next)
		})
		this.router.post("/user/image", uploadImage, (request: Request, response: Response, next: NextFunction) => {
			this.postUserImage(request, response, next)
		})
		this.router.post("/user/changePassword", (request: Request, response: Response, next: NextFunction) => {
			this.changePassword(request, response, next)
		})
		server.use("/api", this.router)
	}

	public async getUser(request: Request, response: Response, next: NextFunction): Promise<void> {
		const userId = request.params.id
		try {

			const user = await this.userDatabase.readUser(userId)

			if (user instanceof Error) {
				next(new ErrorResponse(9111, user.message, 500))
				return
			}

			// Success
			response.json(user)

		} catch (error: any) {
			next(new ErrorResponse(9113, error.message, 500))
		}
	}

	public async searchUser(request: Request, response: Response, next: NextFunction): Promise<void> {
		const search = request.params.search
		try {

			const user = await this.userDatabase.searchUser(search)

			if (user instanceof Error) {
				next(new ErrorResponse(9111, user.message, 500))
				return
			}

			// Success
			response.json(user)

		} catch (error: any) {
			next(new ErrorResponse(9113, error.message, 500))
		}
	}

	public async getCurrentUser(request: Request, response: Response, next: NextFunction): Promise<void> {
		const userId = response.locals.userId
		try {

			const user = await this.userDatabase.readUser(userId)

			if (user instanceof Error) {
				next(new ErrorResponse(9114, user.message, 500))
				return
			}

			// Success
			response.json(user)

		} catch (error: any) {
			next(new ErrorResponse(9115, error.message, 500))
		}
	}

	public async changePassword(request: Request, response: Response, next: NextFunction): Promise<void> {

		const userId = response.locals.userId
		const currentPassword = request.body.currentPassword
		const newPassword = request.body.newPassword

		if (!this.validator.validatePassword(newPassword)) {
			next(new ErrorResponse(9118, "Senha inválida", 400))
			return
		}
		try {
			const user = await this.userDatabase.readUser(userId)

			if (user instanceof Error) {
				next(new ErrorResponse(9119, user.message, 500))
				return
			}
			const match = await bcrypt.compare(currentPassword, user.password)
			if (!match) {
				next(new ErrorResponse(9120, "Senha incorreta", 401))
				return
			}
			user.password = await bcrypt.hash(newPassword, 10)
			const updatedUser = await this.userDatabase.updateUser(user)
			if (updatedUser instanceof Error) {
				next(new ErrorResponse(9121, updatedUser.message, 500))
				return
			}
			// @ts-expect-error
			delete updatedUser.password
			// Successo
			response.json(updatedUser)

		} catch (error: any) {
			next(new ErrorResponse(9122, error.message, 500))
		}
	}

	public async postUserImage(request: Request, response: Response, next: NextFunction): Promise<void> {

		const userId = response.locals.userId
		const image = request.file
		let errors: any = []

		// Compressão da imagem
		await compressImage(image, 600)
			.then((newfile: string) => {
				console.log("Upload e compressão realizados com sucesso!: " + newfile)
			})
			.catch((err: any) => console.log(err))

		try {

			const user = await this.userDatabase.readUser(userId)

			if (user instanceof Error) {
				errors.push(new ErrorResponse(9123, user.message, 500))
			}

			if (!image || !this.validator.validateFile(image)) {
				errors.push(new ErrorResponse(9124, "Imagem de perfil inválida", 400))
			}

			if (errors.length > 0) {

				fs.unlink(image?.path as string, (err) => {
					errors.push(err)
				})

				next(new ErrorResponse(9141, errors[0].message, 400))
				return
			}

			if (user.image && user.image !== "") {
				let path = user.image
				fs.unlink(path, () => { })
			}

			user.image = process.env.BASE_URL + (image as any).path

			await this.updateUser(user, response, next)


		} catch (error: any) {
			fs.unlink(image?.path as string, () => { })
			next(new ErrorResponse(9122, error.message, 500))
		}
	}

	public async putUser(request: Request, response: Response, next: NextFunction): Promise<void> {

		console.log(request.body)

		const userId = response.locals.userId

		const fullname = request.body.fullname
		const cpf = request.body.cpf
		const birthday = request.body.birthday
		const about = request.body.about
		const phone = request.body.phone
		const profile = request.body.profile
		const courses = request.body.courses

		if (about && !this.validator.validateAbout(fullname)) {
			next(new ErrorResponse(9128, "Nome inválido", 400))
			return
		}

		if (cpf && !this.validator.validateCPF(cpf)) {
			next(new ErrorResponse(9128, "CPF com formato inválido", 400))
			return
		}

		if (birthday && !this.validator.validateDataNasc(birthday)) {
			next(new ErrorResponse(9128, "Data de nascimento inválida", 400))
			return
		}

		if (phone && !this.validator.validatePhone(phone)) {
			next(new ErrorResponse(9127, "Telefone inválido", 400))
			return
		}

		if (about && !this.validator.validateAbout(about)) {
			next(new ErrorResponse(9128, "Descrição inválida", 400))
			return
		}

		if (profile && !this.validator.validateArray(profile)) {
			next(new ErrorResponse(9128, "Perfil de aprendizagem inválido", 400))
			return
		}

		if (courses && !this.validator.validateArray(courses)) {
			next(new ErrorResponse(9128, "Identificação do curso inválida", 400))
			return
		}

		const user = await this.userDatabase.readUser(userId)

		if (user instanceof Error) {
			next(new ErrorResponse(9129, user.message, 500))
			return
		}

		console.log(user)

		if (fullname || cpf || birthday || phone || about || profile || courses) {
			user.fullname = fullname || user.fullname
			user.cpf = cpf || user.cpf
			user.birthday = birthday || user.birthday
			user.about = about || user.about
			user.phone = phone || user.phone
			user.profile = profile || user.profile
			user.courses = courses || user.courses

			await this.updateUser(user, response, next)
			return
		}

		// Fails if no parameter is present
		next(new ErrorResponse(9132, "Parâmetros inválidos", 400))

	}

	private async updateUser(updatedUser: User, response: Response, next: NextFunction): Promise<void> {

		const session = response.locals.session

		try {
			const user = await this.userDatabase.updateUser(updatedUser)

			if (user instanceof Error) {
				next(new ErrorResponse(9131, user.message, 500))
				return
			}

			// @ts-expect-error
			delete user.password
			user.token = session.token

			// Success
			response.json(user)

		} catch (error: any) {
			next(new ErrorResponse(9122, error.message, 500))
		}
	}

}
