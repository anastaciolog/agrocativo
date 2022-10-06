import { Knex } from "knex"
import { CourseEntity } from "../models/Course"
import { CourseDatabaseInterface } from "./CourseDatabaseInterface"
import { readdir } from 'fs/promises';
import { existsSync } from "fs";
import path from "path";

class Files {
	intro: Array<{ name: string, url: string }> = []
	new_content: Array<{ name: string, url: string }> = []
	library: Array<{ name: string, url: string }> = []
}

export default class CourseDatabase implements CourseDatabaseInterface {

	private database: Knex

	constructor(database: Knex = require("../../../../db/knex")) {
		this.database = database
	}

	public async voteComment(comment_id: string, user_id: string, type: string): Promise<any | Error> {

		const comment = await this.database('tb_course_lesson_comment as c').where('c.id', comment_id).first()

		if (comment) {
			let downvotes: string[] = comment.downvote
			let upvotes: string[] = comment.upvote

			if (type === 'downvote') {
				let id = downvotes.findIndex(d => d === user_id)
				id > -1 ? downvotes.splice(id, 1) : downvotes.push(user_id)
				await this.database('tb_course_lesson_comment').where('id', comment_id).update({ downvote: downvotes })

				let iu = upvotes.findIndex(d => d === user_id)
				if (iu > -1) {
					upvotes.splice(iu, 1)
					await this.database('tb_course_lesson_comment').where('id', comment_id).update({ upvote: upvotes })
				}
			}
			if (type === 'upvote') {
				let iu = upvotes.findIndex(d => d === user_id)
				iu > -1 ? upvotes.splice(iu, 1) : upvotes.push(user_id)
				await this.database('tb_course_lesson_comment').where('id', comment_id).update({ upvote: upvotes })

				let id = upvotes.findIndex(d => d === user_id)
				if (id > -1) {
					upvotes.splice(id, 1)
					await this.database('tb_course_lesson_comment').where('id', comment_id).update({ downvote: downvotes })
				}
			}
		}

		try {
			const result = await this.database('tb_course_lesson_comment as c').where('c.id', comment_id).first()
			return result
		} catch (error) {
			return error as Error
		}

	}

	public async checkReplyCourse(course_id: string, user_id: string): Promise<any | Error> {

		let new_content_reply: any[] = []
		let lesson_reply: any[] = []


		let course = await this.database('tb_course_reply as cr')
			.where('cr.course_id', course_id)
			.where('cr.student_id', user_id)
			.join('tb_course as c', 'c.id', 'cr.course_id')
			.join('tb_user as u', 'u.id', 'cr.student_id')
			.select('cr.*', 'c.image', 'c.name', 'c.duration', 'u.fullname as student_name', 'u.email as student_email')
			.first()

		if (course) {

			course['rate'] = 0

			new_content_reply = JSON.parse(course['new_content_reply'])
			lesson_reply = JSON.parse(course['lesson_reply'])

			for (let i = 0; i < lesson_reply.length; i++) {
				const lesson = await this.database('tb_course_lesson as l').where('l.id', lesson_reply[i]['option_id']).first()
				let options: any[] = JSON.parse(lesson.options)
				lesson_reply[i]['correct'] = options[options.findIndex(o => o.correct)]['key']
				lesson_reply[i]['key'] = options[options.findIndex(o => o.correct)]['content']
			}

			if (new_content_reply.length > 0) {
				for (let i = 0; i < new_content_reply.length; i++) {
					new_content_reply[i]['feedback'] = new_content_reply[i] !== null ? 'APROVADO' : 'REPROVADO'
				}
			}

			if (lesson_reply.length > 0) {
				let count: number = 0
				for (let i = 0; i < lesson_reply.length; i++) {
					if (lesson_reply[i]['correct'] === lesson_reply[i]['reply']) {
						lesson_reply[i]['feedback'] = 'APROVADO'
						count++
					} else {
						lesson_reply[i]['feedback'] = 'REPROVADO'
					}
					delete lesson_reply[i]['correct']
				}
				course['rate'] = count
			}
		}

		try {
			const result = course ? { course, new_content_reply, lesson_reply } : null
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async checkResult(entity: CourseEntity): Promise<any | Error> {

		let resume: any[] = []

		if (entity.data) {

			for (let i = 0; i < entity.data.lesson_reply.length; i++) {
				let lesson = await this.database('tb_course_lesson as l').where('l.id', entity.data.lesson_reply[i]['option_id']).first()
				let options: any[] = JSON.parse(lesson.options)
				if (entity.data.lesson_reply[i]['reply'] === options[options.findIndex(o => o.correct)]['key']) {
					lesson['correct'] = true
				} else {
					lesson['correct'] = false
				}
				resume.push(lesson)
			}
		}

		try {
			const result = resume
			return result
		} catch (error) {
			return error as Error
		}

	}

	public async readComments(data: string[]): Promise<any | Error> {

		let comments: any[] = []
		let tasks: any[] = []

		for (let i = 0; i < data.length; i++) {
			const queryTask = await this.database('tb_course_lesson as t').where('t.id', data[i]).select('t.id', 't.description').first()
			tasks.push(queryTask)
		}

		for (let i = 0; i < tasks.length; i++) {
			let queryComments = await this.database('tb_course_lesson_comment as c')
				.where('c.lesson_id', tasks[i].id)
				.join('tb_user as u', 'u.id', 'c.user_id')
				.select(
					'c.*',
					'u.fullname as name',
					'u.id as user_id',
					'u.image'
				)

			for (let ic = 0; ic < queryComments.length; ic++) {
				if (!queryComments[ic].upvote) queryComments[ic].upvote = []
				if (!queryComments[ic].downvote) queryComments[ic].downvote = []
			}

			comments.push({
				task: {
					id: tasks[i].id,
					description: tasks[i].description
				},
				comments: queryComments
			})

		}

		try {
			const result = comments
			return result
		} catch (error) {
			return error as Error
		}

	}

	public async getCertificate(course_reply_id: string): Promise<any | Error> {
		try {
			const reply = await this.database('tb_course_reply as cr')
				.where('cr.id', course_reply_id)
				.whereNotNull('feedback')
				.first()

			if (!reply) return null

			const course = await this.database('tb_course as c')
				.where('c.id', reply.course_id)
				.first()

			if (!course) return null

			const student = await this.database('tb_user as us')
				.where('us.id', reply.student_id)
				.first()
			if (!student) return null

			const teacher = await this.database('tb_user as ut')
				.where('ut.id', course.teacher_id)
				.first()

			if (!teacher) return null

			const result = {
				id: reply.course_id,
				course: course.name,
				duration: course.duration,
				student: student.fullname,
				teacher: teacher.fullname,
				date: reply.created_at
			}
			return result

		} catch (error) {
			return error as Error
		}

	}

	public async readSubmitCourses(teacher_id: string): Promise<any[] | Error> {

		let myCourses = await this.database('tb_course as c').where('c.teacher_id', teacher_id).where('c.active', true) || null

		if (myCourses) {
			for (let i = 0; i < myCourses.length; i++) {

				let course = await this.database('tb_course_reply as cr')
					.where('cr.course_id', myCourses[i].id)
					.where('cr.rate', '>', 2)
					.whereNull('cr.feedback')
					.join('tb_user as u', 'u.id', 'cr.student_id')
					.select('cr.*', 'u.fullname as student_name', 'u.email as student_email')

				if (course) {
					for (let i = 0; i < course.length; i++) {

						let lesson_reply: any[] = JSON.parse(course[i]['lesson_reply'])
						let new_content_reply: any[] = JSON.parse(course[i]['new_content_reply'])

						for (let i = 0; i < lesson_reply.length; i++) {
							const lesson = await this.database('tb_course_lesson as l').where('l.id', lesson_reply[i]['option_id']).first()
							let options: any[] = JSON.parse(lesson.options)
							lesson_reply[i]['correct'] = options[options.findIndex(o => o.correct)]['key']
						}
						for (let inc = 0; inc < new_content_reply.length; inc++) {
							const new_content = await this.database('tb_course_new_content_option as nc').where('nc.id', new_content_reply[inc]['option_id']).first()
							new_content_reply[inc]['description'] = new_content['description']
						}
						course[i]['new_content_reply'] = new_content_reply
						course[i]['lesson_reply'] = lesson_reply
					}

					myCourses[i]['reply'] = course
				}
			}
		}

		try {
			const result = myCourses
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async readStudentsByCourse(teacher_id: string): Promise<any[] | Error> {

		let studentsList: any[] = []
		const myCourses = await this.database('tb_course as c').where('c.teacher_id', teacher_id).select('c.id')
		const students = await this.database('tb_user as u').where('u.role', 'ALUNO').whereNotNull('u.courses')

		console.log(myCourses)
		console.log(students.length)

		if (myCourses && students) {

			// percorre todos os alunos
			for (let i = 0; i < students.length; i++) {
				let courses: any[] = students[i].courses
				for (let is = 0; is < myCourses.length; is++) {
					if (courses.findIndex(c => c === myCourses[is].id) > -1 && studentsList.findIndex(s => s.id === students[i].id) === -1) studentsList.push(students[i])
				}

			}
		}

		try {
			const result = studentsList
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async create(entity: CourseEntity): Promise<any | Error> {

		console.log('Entity --- > ', entity)
		const query = this.database(`tb_${entity.type}`)
			.insert(entity.model)
			.returning("*")

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async readClassroom(id: string): Promise<any | Error> {

		let classroom = {} as any

		let files = new Files()

		classroom = await this.database('tb_course_classroom').where('id', id).first()

		const step_intro = this.database('tb_course_step_intro as sin').where('sin.classroom_id', id).first()
		const step_new_content = this.database('tb_course_step_new_content as snc').where('snc.classroom_id', id).first()
		const step_library = this.database('tb_course_step_library as sly').where('sly.classroom_id', id).first()
		const step_lesson = this.database('tb_course_step_lesson as sls').where('sls.classroom_id', id).first()

		await Promise.all([
			step_intro,
			step_new_content,
			step_library,
			step_lesson
		]).then((res) => {
			classroom.step_intro = res[0] || null
			classroom.step_new_content = res[1] || null
			classroom.step_library = res[2] || null
			classroom.step_lesson = res[3] || null
		})

		if (classroom.step_new_content) {
			classroom.step_new_content["tasks"] = await this.database('tb_course_new_content_option as no').where('no.new_content_id', classroom["step_new_content"]["id"]) || null
		}

		if (classroom.step_lesson) {
			classroom.step_lesson["tasks"] = await this.database('tb_course_lesson as lo').where('lo.lesson_id', classroom["step_lesson"]["id"]) || null
		}

		const temp = await readdir(`public/file/${id}`)

		for (const f of temp) {

			let file = {
				name: f,
				url: `${process.env.BASE_URL}public/file/${id}/${f}`
			}

			if (f.split('_')[0].includes('intro')) files.intro.push(file)
			if (f.split('_')[0].includes('newcontent')) files.new_content.push(file)
			if (f.split('_')[0].includes('library')) files.library.push(file)
		}

		classroom.files = files

		console.log(classroom)

		try {
			const result = classroom
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async readOne(entity: CourseEntity): Promise<any | Error> {

		const query = this.database(`tb_${entity.type}`)

		query.where(entity.params[0].field, entity.params[0].value)
		query.first()

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async readFullCourse(id: string, profile: string[], user_id: string): Promise<any | Error> {

		let data = {} as any
		let modules = {} as any
		let ext: string[] = []
		let files = new Files()

		let checkCourse = await this.database('tb_course_reply as cr').where('cr.course_id', id).where('cr.student_id', user_id).first()

		const course = this.database('tb_course as c').where('c.id', id).where('c.active', true).first()
		const module = this.database('tb_course_module as m').where('m.course_id', id)

		const query = await Promise.all([course, module])

		data = query[0]
		modules = query[1]

		for (let i = 0; i < modules.length; i++) {
			const aulas = await this.database('tb_course_classroom as a').where('a.module_id', modules[i].id)
			modules[i]["classroom"] = aulas
		}

		data["modules"] = modules
		data["submited"] = false

		if (checkCourse) {
			data["rate"] = checkCourse.rate
		}

		if (data.modules && data.modules.length > 0) {
			for (let i = 0; i < data.modules.length; i++) {
				if (data.modules[i].classroom && data.modules[i].classroom.length > 0) {

					for (let is = 0; is < data.modules[i].classroom.length; is++) {

						data.modules[i].classroom[is]["steps"] = {}

						const step_intro = await this.database('tb_course_step_intro as sin').where('sin.classroom_id', data.modules[i].classroom[is].id).first() || null
						const step_new_content = await this.database('tb_course_step_new_content as snc').where('snc.classroom_id', data.modules[i].classroom[is].id).first() || null
						const step_library = await this.database('tb_course_step_library as sly').where('sly.classroom_id', data.modules[i].classroom[is].id).first() || null
						const step_lesson = await this.database('tb_course_step_lesson as sls').where('sls.classroom_id', data.modules[i].classroom[is].id).first() || null

						data.modules[i].classroom[is].steps["step_intro"] = step_intro
						data.modules[i].classroom[is].steps["step_new_content"] = step_new_content
						data.modules[i].classroom[is].steps["step_library"] = step_library
						data.modules[i].classroom[is].steps["step_lesson"] = step_lesson

						if (data.modules[i].classroom[is].steps && data.modules[i].classroom[is].steps.step_new_content && data.modules[i].classroom[is].steps.step_new_content.id) {
							data.modules[i].classroom[is].steps.step_new_content["tasks"] = await this.database('tb_course_new_content_option as no').where('no.new_content_id', data.modules[i].classroom[is].steps.step_new_content.id) || null
						}

						if (data.modules[i].classroom[is].steps && data.modules[i].classroom[is].steps.step_lesson && data.modules[i].classroom[is].steps.step_lesson.id) {

							let tasks = await this.database('tb_course_lesson as lo').where('lo.lesson_id', data.modules[i].classroom[is].steps.step_lesson.id) || null
							if (tasks) {
								for (let i = 0; i < tasks.length; i++) {
									let options = JSON.parse(tasks[i]["options"])
									for (let io = 0; io < options.length; io++) {
										delete options[io].correct
										options[io]['reply'] = null
									}
									tasks[i]['options'] = options
								}
								data.modules[i].classroom[is].steps.step_lesson["tasks"] = tasks
							}
						}

						let filter = []

						for (const p of profile) {
							switch (p) {
								case 'V':
									filter.push('.mp4', '.png', '.jpeg', '.jpg', '.wmv', '.avi')
									break;
								case 'A':
									filter.push('.mp3')
									break;
								case 'R':
									filter.push('.pdf', '.docx', '.txt', '.xlsx', '.pptx', '.ppt', '.doc')
									break;
								case 'K':
									filter.push('.mp3', '.mp4', '.png', '.jpeg', '.jpg', '.wmv', '.avi')
									break;
							}
						}

						for (let i = 0; i < filter.length; i++) {
							if (filter[i] !== ext[i]) {
								ext.push(filter[i])
							}
						}

						let dir = `public/file/${data.modules[i].classroom[is].id}`

						if (existsSync(dir)) {
							const temp = await readdir(dir)

							for (const f of temp) {

								if (ext.findIndex(e => e === path.extname(f)) > -1) {
									let file = {
										name: f,
										url: `${process.env.BASE_URL}${dir}/${f}`
									}

									if (f.split('_')[0].includes('intro')) files.intro.push(file)
									if (f.split('_')[0].includes('newcontent')) files.new_content.push(file)
									if (f.split('_')[0].includes('library')) files.library.push(file)

								}
							}
						}

						data.modules[i].classroom[is]["files"] = files
						files = new Files()

					}
				}
			}
		}

		try {
			const result = data
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async readMultiple(entity: CourseEntity): Promise<any[] | Error> {

		const query = this.database(`tb_${entity.type}`)

		entity.params.forEach((p: any) => {
			if (Array.isArray(p.value)) {
				query.whereIn(p.field, p.value)
			} else {
				if (p.operator && p.operator !== '') {
					query.where(p.field, p.operator, p.value)
				} else {
					query.where(p.field, p.value)
				}
			}
		})

		if (entity.orderBy) {
			entity.orderBy.forEach((o: any) => {
				query.orderBy(o.field, o.sort)
			})
		}

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async update(entity: CourseEntity): Promise<any | Error> {

		const query = this.database(`tb_${entity.type}`)

		query.where(entity.params[0].field, entity.params[0].value)
		query.update(entity.model)
		query.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}

	public async delete(entity: CourseEntity): Promise<any | Error> {

		const query = this.database(`tb_${entity.type}`)

		entity.params.forEach((p: any) => {
			query.where(p.field, p.value)
		})

		query.delete()

		try {
			const result = await query
			return result
		} catch (error) {
			return error as Error
		}
	}

	public async feedback(id: string, content: string): Promise<any | Error> {

		const query = this.database('tb_course_reply as cr')

		query.where('cr.id', id)
		query.update({ feedback: content })
		query.returning("*")

		try {
			const result = await query
			return result[0]
		} catch (error) {
			return error as Error
		}
	}
}
