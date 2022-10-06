import { NextFunction } from "express"
import ErrorResponse from "../../../utils/ErrorResponse"
import { ValidatorRequest } from "../../../utils/ValidatorRequest"

export class Course {

	public id?: string
	public teacher_id?: string | null
	public name?: string
	public duration?: number
	public description?: string
	public image?: string
	public active?: boolean

	constructor(data: any, userId: string | null, next: NextFunction) {

		if (data) {

			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.description && !validator.validateAbout(data.description)) {
				next(new ErrorResponse(9128, "Descrição inválida", 400))
			}

			if (data.name && !validator.validateAbout(data.name)) {
				next(new ErrorResponse(9128, "Nome inválido", 400))
			}

			if (data.duration && typeof data.duration !== "number") {
				next(new ErrorResponse(9128, "Duração inválida", 400))
			}

			// if (data.image !== undefined && !validator.validateAbout(data.image)) {
			// 	next(new ErrorResponse(9128, "Imagem inválida", 400))
			// }

			if (data.active !== undefined && !validator.validateBoolean(data.active)) {
				next(new ErrorResponse(9128, "Status inválido", 400))
			}

			this.id = data.id
			this.teacher_id = userId
			this.name = data.name
			this.duration = data.duration
			this.description = data.description
			this.image = data.image
			this.active = data.active
		}
	}
}

export class CourseModule {

	public id?: string
	public course_id?: string
	public name?: string
	public active?: boolean
	public description?: string

	constructor(data: any, userId: string | null, next: NextFunction) {
		if (data) {

			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.name && !validator.validateAbout(data.name)) {
				next(new ErrorResponse(9128, "Nome inválido", 400))
			}

			if (data.name && !validator.validateAbout(data.description)) {
				next(new ErrorResponse(9128, "Descrição inválida", 400))
			}

			this.id = data.id
			this.course_id = data.course_id
			this.name = data.name
			this.active = data.active
			this.description = data.description
		}
	}

}

export class CourseClassroom {

	public id?: string
	public module_id?: string
	public name?: string

	constructor(data: any, userId: string | null, next: NextFunction) {
		if (data) {

			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.name && !validator.validateAbout(data.name)) {
				next(new ErrorResponse(9128, "Nome inválido", 400))
			}

			this.id = data.id
			this.module_id = data.module_id
			this.name = data.name
		}
	}

}

export class CourseStep {

	public id?: string
	public classroom_id?: string
	public description?: string

	constructor(data: any, userId: string | null, next: NextFunction) {

		if (data) {
			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.description && !validator.validateAbout(data.description)) {
				next(new ErrorResponse(9128, "Descrição inválido", 400))
			}

			this.id = data.id
			this.classroom_id = data.classroom_id
			this.description = data.description
		}
	}

}

export class CourseLesson {

	public id?: string
	public lesson_id?: string
	public description?: string
	public options?: string

	constructor(data: any, userId: string | null, next: NextFunction) {
		if (data) {

			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.description && !validator.validateAbout(data.description)) {
				next(new ErrorResponse(9128, "Descrição inválida", 400))
			}

			if (data.options && !validator.validateArray(JSON.parse(data.options))) {
				next(new ErrorResponse(9128, "Alternativas inválidas", 400))
			}

			this.id = data.id
			this.lesson_id = data.lesson_id
			this.description = data.description
			this.options = data.options
		}
	}

}

export class CourseLessonOption {

	public id?: string
	public lesson_id?: string
	public description?: string
	public correct?: boolean
	public key?: string

	constructor(data: any, userId: string | null, next: NextFunction) {
		if (data) {

			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.description && !validator.validateAbout(data.description)) {
				next(new ErrorResponse(9128, "Descrição inválida", 400))
			}

			if (data.correct !== undefined && !validator.validateBoolean(data.correct)) {
				next(new ErrorResponse(9128, "Opção inválida", 400))
			}

			this.id = data.id
			this.lesson_id = data.lesson_id
			this.description = data.description
			this.correct = data.correct
			this.key = data.key
		}
	}

}

export class CourseNewContentOption {

	public id?: string
	public new_content_id?: string
	public description?: string

	constructor(data: any, userId: string | null, next: NextFunction) {
		if (data) {

			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.description && !validator.validateAbout(data.description)) {
				next(new ErrorResponse(9128, "Conteúdo inválido", 400))
			}

			this.id = data.id
			this.new_content_id = data.new_content_id
			this.description = data.description
		}
	}
}

export class CourseLessonComment {

	public id?: string
	public lesson_id?: string
	public content?: string
	public user_id?: string

	constructor(data: any, userId: string | null, next: NextFunction) {
		if (data) {
			const validator: ValidatorRequest = new ValidatorRequest()
			if (data.content && !validator.validateAbout(data.content)) {
				next(new ErrorResponse(9128, "Conteúdo inválido", 400))
			}
			this.id = data.id
			this.lesson_id = data.lesson_id
			this.content = data.content
			this.user_id = userId as string
		}
	}
}

export class CourseReply {

	public id?: string
	public course_id?: string
	public student_id?: string | null
	public new_content_reply?: string
	public lesson_reply?: string
	public rate?: number
	public feedback?: string

	constructor(data: any, userId: string | null, next: NextFunction) {

		if (data) {

			const validator: ValidatorRequest = new ValidatorRequest()

			if (data.feedback && !validator.validateAbout(data.feedback)) {
				next(new ErrorResponse(9128, "Descrição inválida", 400))
			}

			if (data.new_content_reply && !validator.validateArray(data.new_content_reply)) {
				next(new ErrorResponse(9128, "Resposta da etapa Novo conteúdo inválida", 400))
			}

			if (data.lesson_reply && !validator.validateArray(data.lesson_reply)) {
				next(new ErrorResponse(9128, "Resposta da etapa Práticas inválida", 400))
			}

			if (data.rate && typeof data.rate !== "number") {
				next(new ErrorResponse(9128, "Pontuação inválida", 400))
			}

			this.id = data.id
			this.student_id = userId
			this.course_id = data.course_id
			this.new_content_reply = JSON.stringify(data.new_content_reply)
			this.lesson_reply = JSON.stringify(data.lesson_reply)
			this.rate = data.rate
			this.feedback = data.feedback
		}
	}
}

export class CourseEntity {

	public type: "course" | "course_module" | "course_classroom" | "course_step_intro" | "course_step_new_content" | "course_step_library" | "course_step_lesson" | "course_lesson" | "course_new_content_option" | "course_lesson_comment" | "course_reply"
	public model: any
	public params: Array<{ field: string, value: any }>
	public data: any
	public orderBy: Array<{ field: string, sort: "asc" | "desc" }>

	constructor(type: any, params: any, data: any, orderBy: any, userId: string | null, next: NextFunction) {

		this.type = type
		this.model = this.setModel(type, data, userId, next)
		this.params = params
		this.data = data
		this.orderBy = orderBy

	}

	private setModel(type: string, data: any, userId: string | null, next: NextFunction) {
		switch (type) {
			case "course": return new Course(data, userId, next)
			case "course_module": return new CourseModule(data, userId, next)
			case "course_classroom": return new CourseClassroom(data, userId, next)
			case "course_step_intro": return new CourseStep(data, userId, next)
			case "course_step_new_content": return new CourseStep(data, userId, next)
			case "course_step_library": return new CourseStep(data, userId, next)
			case "course_step_lesson": return new CourseStep(data, userId, next)
			case "course_lesson": return new CourseLesson(data, userId, next)
			case "course_new_content_option": return new CourseNewContentOption(data, userId, next)
			case "course_reply": return new CourseReply(data, userId, next)
			case "course_lesson_comment": return new CourseLessonComment(data, userId, next)
			default: return null
		}
	}
}

