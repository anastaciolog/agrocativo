import { Express, NextFunction, Request, Response } from "express"
import fs from "fs"
import { AuthenticationRouter } from "./routes/auth/AuthenticationRouter"
import { RouterInterface } from "./routes/RouterInterface"
import { UserRouter } from "./routes/user/UserRouter"
import SessionDatabase from "./rules/session/database/SessionDatabase"
import ErrorResponse from "./utils/ErrorResponse"
import UserDatabase from "./rules/user/database/UserDatabase"
import { CourseRouter } from "./routes/course/CourseRouter"

export default function setupRoutes(
	server: Express,
	toogleLogin: boolean = true,
	whiteList: string[] = []
) {

	const sessionDatabase = new SessionDatabase()
	const userDatabase = new UserDatabase()

	if (toogleLogin) {

		// Applying token validation to all API routes
		server.all("/api/*", async (request, response, next) => {

			// Handling whitelist routes
			const method = request.method
			const path = request.path
			if (whiteList.includes(`${method}:${path}`)) {
				next()
				return
			}

			const token = request.headers.token

			if (typeof token !== "string") {
				// Unauthorized
				next(new ErrorResponse(1000, "Token inválido", 401))
				return
			}

			const session = await sessionDatabase.readSession(token)

			if (session instanceof Error) {
				next(new ErrorResponse(1001, session.message, 500))
				return
			}

			if (!session) {
				next(new ErrorResponse(1002, "Token inválido", 401))
				return
			}

			const user = await userDatabase.readUser(session.user_id)

			if (user instanceof Error) {
				next(new ErrorResponse(1001, user.message, 500))
				return
			}

			if (!user.active) {
				next(new ErrorResponse(3120, "Sua conta está desativada", 401))
				return
			}

			response.locals.session = session
			response.locals.userId = session.user_id
			response.locals.role = user.role
			response.locals.profile = user.profile || []
			next()
		})
	}

	const routers: RouterInterface[] = [
		new AuthenticationRouter(),
		new CourseRouter(),
		new UserRouter()
	]

	routers.forEach((router) => {
		router.setupRoutes(server)
	})

	// Error Handler
	server.use((error: any, request: Request, response: Response, next: NextFunction) => {
		console.log(error)
		const status = error.status || 500
		response.status(status).json(error)
	})


	// Termos de Uso e Política de Privacidade ( LGPD )
	server.get("/terms", (request: Request, response: Response, next: NextFunction) => {
		const tempFile = "./termos.pdf"
		fs.readFile(tempFile, (error: any, data: any) => {
			response.contentType("application/pdf")
			response.send(data)
		})
	})

	// Status do servidor
	server.get("/status", (request: Request, response: Response, next: NextFunction) => {
		response.json({
			status: "Active",
			timestamp: new Date()
		})
	})

}
