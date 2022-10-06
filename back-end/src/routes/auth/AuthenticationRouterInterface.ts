import { NextFunction, Request, Response } from "express"

export interface AuthenticationRouterInterace {

	login(request: Request, response: Response, next: NextFunction): void

	logout(request: Request, response: Response, next: NextFunction): void

	register(request: Request, response: Response, next: NextFunction): void

	checkEmailAvailability(request: Request, response: Response, next: NextFunction): void

	confirmedLogin(request: Request, response: Response, next: NextFunction): void
}
