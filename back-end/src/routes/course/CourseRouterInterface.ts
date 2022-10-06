import { NextFunction, Request, Response } from "express"

export default interface CourseRouterInterface {

	readOne(request: Request, response: Response, next: NextFunction): void
	readMultiple(request: Request, response: Response, next: NextFunction): void
	create(request: Request, response: Response, next: NextFunction): void
	postCourseImage(request: Request, response: Response, next: NextFunction): void
	update(request: Request, response: Response, next: NextFunction): void
	delete(request: Request, response: Response, next: NextFunction): void

}
