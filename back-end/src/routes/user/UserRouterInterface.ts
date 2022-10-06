import { NextFunction, Request, Response } from "express"

export default interface UserRouterInterface {

	getUser(request: Request, response: Response, next: NextFunction): void
	searchUser(request: Request, response: Response, next: NextFunction): void
	getCurrentUser(request: Request, response: Response, next: NextFunction): void
	changePassword(request: Request, response: Response, next: NextFunction): void
	postUserImage(request: Request, response: Response, next: NextFunction): void
	putUser(request: Request, response: Response, next: NextFunction): void

}
