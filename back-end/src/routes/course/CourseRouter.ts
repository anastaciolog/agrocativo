import fs from "fs"
import { Express, NextFunction, Request, Response, Router } from "express"
import CourseDatabase from "../../rules/course/database/CourseDatabase"
import { CourseDatabaseInterface } from "../../rules/course/database/CourseDatabaseInterface"
import { CourseEntity } from "../../rules/course/models/Course"
import { RouterInterface } from "../RouterInterface"
import { ValidatorRequest } from "../../utils/ValidatorRequest"
import ErrorResponse from "../../utils/ErrorResponse"
import { uploadImage } from "../../services/ImageUploader"
import CourseRouterInterface from "./CourseRouterInterface"
import { UserDatabaseInterface } from "../../rules/user/database/UserDatabaseInterface"
import UserDatabase from "../../rules/user/database/UserDatabase"
import { generateId } from "../../utils/idGenerator"
import { compressImage } from "../../services/CompressImage"
import { uploadFile } from "../../services/FileCourseUploader"
import Pdfmake from 'pdfmake'
import Certificate from "../../rules/course/models/Certificate"

require('dotenv').config()

export class CourseRouter implements RouterInterface, CourseRouterInterface {

    private router: Router
    private courseDatabase: CourseDatabaseInterface
    private userDatabase: UserDatabaseInterface
    private validator: ValidatorRequest

    constructor(
        router: Router = Router(),
        courseDatabase: CourseDatabaseInterface = new CourseDatabase(),
        userDatabase: UserDatabaseInterface = new UserDatabase(),
        validator: ValidatorRequest = new ValidatorRequest()) {

        this.router = router
        this.courseDatabase = courseDatabase
        this.userDatabase = userDatabase
        this.validator = validator
    }

    public setupRoutes(server: Express): void {
        this.router.get("/course/certificate/:id", (request: Request, response: Response, next: NextFunction) => {
            this.getCertificate(request, response, next)
        })
        this.router.post("/course/comment/vote", (request: Request, response: Response, next: NextFunction) => {
            this.voteComment(request, response, next)
        })
        this.router.post("/course/comments", (request: Request, response: Response, next: NextFunction) => {
            this.getComments(request, response, next)
        })
        this.router.post("/course/comment", (request: Request, response: Response, next: NextFunction) => {
            this.postComment(request, response, next)
        })
        this.router.post("/course/submit", (request: Request, response: Response, next: NextFunction) => {
            this.submitCourse(request, response, next)
        })
        this.router.get("/classroom", (request: Request, response: Response, next: NextFunction) => {
            this.readClassroom(request, response, next)
        })
        this.router.get("/course/students/list", (request: Request, response: Response, next: NextFunction) => {
            this.readStudentsByCourse(request, response, next)
        })
        this.router.get("/course", (request: Request, response: Response, next: NextFunction) => {
            this.readOne(request, response, next)
        })
        this.router.get("/course/:id", (request: Request, response: Response, next: NextFunction) => {
            this.readFullCourse(request, response, next)
        })
        this.router.get("/courses/submit", (request: Request, response: Response, next: NextFunction) => {
            this.readSubmitCourses(request, response, next)
        })
        this.router.get("/courses/submit/:id", (request: Request, response: Response, next: NextFunction) => {
            this.checkSubmitCourse(request, response, next)
        })
        this.router.post("/course/search", (request: Request, response: Response, next: NextFunction) => {
            this.readMultiple(request, response, next)
        })
        this.router.post("/course/feedback", (request: Request, response: Response, next: NextFunction) => {
            this.feedback(request, response, next)
        })
        this.router.post("/course", (request: Request, response: Response, next: NextFunction) => {
            this.create(request, response, next)
        })
        this.router.put("/course/:id", (request: Request, response: Response, next: NextFunction) => {
            this.update(request, response, next)
        })
        this.router.post("/course/image/:id", uploadImage, (request: Request, response: Response, next: NextFunction) => {
            this.postCourseImage(request, response, next)
        })
        this.router.delete("/course/:type/:id", (request: Request, response: Response, next: NextFunction) => {
            this.delete(request, response, next)
        })
        this.router.post("/course/upload/:type/:id", uploadFile, (request: Request, response: Response, next: NextFunction) => {
            this.upload(request, response, next)
        })
        this.router.post("/course/file/delete", (request: Request, response: Response, next: NextFunction) => {
            this.deleteFile(request, response, next)
        })
        server.use("/api", this.router)
    }

    public async getCertificate(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId as string
        const role = response.locals.role as string
        const course_reply_id = request.params.id as string

        if (role !== "ALUNO") {
            next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
            return
        }

        try {

            const fonts = {
                Roboto: {
                    normal: 'src/fonts/Montserrat-Regular.ttf',
                    bold: 'src/fonts/Montserrat-Bold.ttf',
                    normalitalic: 'src/fonts/Montserrat-RegularItalic.ttf',
                    bolditalic: 'src/fonts/Montserrat-BoldItalic.ttf'
                }
            }

            const pdf = new Pdfmake(fonts)

            const certificate = await this.courseDatabase.getCertificate(course_reply_id)

            if (certificate instanceof Error) {
                next(new ErrorResponse(9111, certificate.message, 500))
                return
            }

            const content = new Certificate(
                certificate.id,
                certificate.student,
                certificate.teacher,
                certificate.course,
                certificate.duration,
                certificate.date
            )

            console.log(content)

            let docDefinition: any = {
                pageSize: 'A4',
                pageOrientation: 'landscape',
                pageMargins: [140, 60, 140, 30],
                images: {
                    logo: 'public/logo.png',
                    brand1: 'public/pgcap.jpeg',
                    brand2: 'public/embrapa.jpeg',
                    brand3: 'public/unipampa.jpeg',
                    footer: 'public/footer.png'
                },
                styles: {
                    header: {
                        fontSize: 22,
                        bold: true
                    },
                    info: {
                        bold: true
                    }
                },
                content: [
                    {
                        image: 'logo',
                        height: 50,
                        width: 250,
                        alignment: 'center'
                    },

                    { text: 'CERTIFICADO', alignment: 'center', style: 'header', margin: [0, 50] },
                    {
                        text: [
                            'Certificamos que o aluno ',
                            { text: content.student, style: 'info' },
                            ' concluiu o curso ',
                            { text: content.course, style: 'info' },
                            ' com carga horária de ',
                            { text: content.duration, style: 'info' },
                            ' horas.'
                        ], alignment: 'center'
                    },
                    { text: `Bagé, ${content.date}`, alignment: 'center', margin: [0, 50] },
                    // { qr: `https://www.agrocativo.com.br/certificate/${certificate.id}`, fit: 80, absolutePosition: { x: 20, y: 508 } },
                    // { text: 'Confira a', absolutePosition: { x: 33, y: 480 }, fontSize: 8, width: 80 },
                    // { text: 'autenticidade', absolutePosition: { x: 25, y: 490 }, fontSize: 8, width: 80 },
                    {
                        columns: [
                            {
                                width: '*',
                                text: content.teacher,
                                alignment: 'center'
                            }, {
                                width: '*',
                                text: content.student,
                                alignment: 'center'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                text: 'Instrutor',
                                alignment: 'center',
                                style: 'info'
                            }, {
                                width: '*',
                                text: 'Aluno',
                                alignment: 'center',
                                style: 'info'
                            },
                        ]
                    },
                    {
                        image: 'footer',
                        alignment: 'center',
                        width: 500,
                        margin: [0, 30, 0, 0]
                    },
                ]
            }

            let pdfDoc = pdf.createPdfKitDocument(docDefinition, {});

            // Success
            let chunks: any[] = []

            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk)
            })
            pdfDoc.on('end', function () {
                let result = Buffer.concat(chunks)
                response.contentType('application/pdf')
                response.send(result)
            })

            pdfDoc.end();

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async postComment(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId as string
        const type = request.body.type as string
        const data = request.body.data

        // Exemplo de body

        // {
        //     "type": "course_lesson_comment",
        //     "data": {
        //         "lesson_id": "3d006e56-4b6a-47cc-8500-3213cb2d461a",
        //         "content": "teste"
        //     }
        // }

        try {
            data.id = generateId()
            const entity = new CourseEntity(type, null, data, null, userId, next)

            const comment = await this.courseDatabase.create(entity)

            if (comment instanceof Error) {
                next(new ErrorResponse(9111, comment.message, 500))
                return
            }

            // Success
            response.json(comment)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async voteComment(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId as string
        const type = request.body.type as string
        const comment_id = request.body.comment_id as string

        // Exemplo de body

        // {
        //     "type": "upvote", // downvote
        //     "comment_id": "3d006e56-4b6a-47cc-8500-3213cb2d461a"
        // }

        try {

            const vote = await this.courseDatabase.voteComment(comment_id, userId, type)

            if (vote instanceof Error) {
                next(new ErrorResponse(9111, vote.message, 500))
                return
            }

            // Success
            response.json(vote)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async getComments(request: Request, response: Response, next: NextFunction): Promise<void> {

        const tasks = request.body.tasks as string[]

        try {

            let comments = await this.courseDatabase.readComments(tasks)

            if (comments instanceof Error) {
                next(new ErrorResponse(9111, comments.message, 500))
                return
            }

            // Success
            response.json(comments)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async submitCourse(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId
        const type = request.body.type
        const data = request.body.data

        // Exemplo de body

        // {
        //     "type": "course_reply",
        //     "data": {
        //         "course_id": "3d006e56-4b6a-47cc-8500-3213cb2d461a",
        //         "new_content_reply": [],
        //         "lesson_reply": []
        //     }
        // }

        try {

            let entity = new CourseEntity(type, null, data, null, userId, next)
            const check = await this.courseDatabase.checkResult(entity)
            console.log(check)

            if (check instanceof Error) {
                next(new ErrorResponse(9111, check.message, 500))
                return
            }

            let result: { rate: number, lesson: any[] } = {} as any
            result.rate = 0
            result.lesson = []

            if (check && check.length > 0) {
                for (let i = 0; i < check.length; i++) {
                    if (check[i].correct) result.rate++
                    result.lesson.push({ description: check[i].description, correct: check[i].correct })
                }
            }

            const checkCourse = await this.courseDatabase.checkReplyCourse(data.course_id, userId)

            if (checkCourse) {
                entity.params = [{ field: 'id', value: checkCourse.course.id }]
                entity.data.id = checkCourse.course.id
                entity.model.id = checkCourse.course.id
                entity.model.rate = result.rate
                const course = await this.courseDatabase.update(entity)
                if (course instanceof Error) {
                    next(new ErrorResponse(9111, course.message, 500))
                    return
                }
            } else {
                let id = generateId()
                entity.data.id = id
                entity.model.id = id
                entity.model.rate = result.rate
                const course = await this.courseDatabase.create(entity)
                if (course instanceof Error) {
                    next(new ErrorResponse(9111, course.message, 500))
                    return
                }
            }

            // Success
            response.json(result)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async readStudentsByCourse(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId as string
        const role = response.locals.role as string

        if (role === "ALUNO") {
            next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
            return
        }

        try {

            const courseStudents = await this.courseDatabase.readStudentsByCourse(userId)

            if (courseStudents instanceof Error) {
                next(new ErrorResponse(9111, courseStudents.message, 500))
                return
            }

            // Success
            response.json(courseStudents)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async readSubmitCourses(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId as string
        const role = response.locals.role as string

        if (role === "ALUNO") {
            next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
            return
        }

        try {

            const courseSubmit = await this.courseDatabase.readSubmitCourses(userId)

            if (courseSubmit instanceof Error) {
                next(new ErrorResponse(9111, courseSubmit.message, 500))
                return
            }

            // Success
            response.json(courseSubmit)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async checkSubmitCourse(request: Request, response: Response, next: NextFunction): Promise<void> {

        const courseId = request.params.id as string
        const userId = response.locals.userId as string

        try {

            const courseCheckSubmit = await this.courseDatabase.checkReplyCourse(courseId, userId)

            if (courseCheckSubmit instanceof Error) {
                next(new ErrorResponse(9111, courseCheckSubmit.message, 500))
                return
            }

            // Success
            response.json(courseCheckSubmit)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async feedback(request: Request, response: Response, next: NextFunction): Promise<void> {

        const courseId = request.body.id as string
        const content = request.body.content as string

        try {

            const feedback = await this.courseDatabase.feedback(courseId, content)

            if (feedback instanceof Error) {
                next(new ErrorResponse(9111, feedback.message, 500))
                return
            }

            // Success
            response.json(feedback)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async deleteFile(request: Request, response: Response, next: NextFunction): Promise<void> {

        const path = request.body.path

        try {

            fs.unlink(path.replace(this.getUrl(request), ''), (err) => {
                if (err) console.log(err)
                console.log(path + ' - Arquivo deletado')
            })

            // Success
            response.json({ message: "Arquivo excluído com sucesso" })

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async readClassroom(request: Request, response: Response, next: NextFunction): Promise<void> {

        const id = request.query.id as string

        /**
         * Exemplo de query
         * https://api.agrocativo.com.br/api/classroom?id=b0d65aca-7501-4274-8e6b-f7d259c6385d
         */

        try {
            console.log(id)
            const course = await this.courseDatabase.readClassroom(id)

            if (course instanceof Error) {
                next(new ErrorResponse(9111, course.message, 500))
                return
            }

            // Success
            response.json(course)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async upload(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId
        const type = request.params.type

        const file = request.file

        try {

            const user = await this.userDatabase.readUser(userId)

            if (user instanceof Error) {
                next(new ErrorResponse(9119, user.message, 500))
                return
            }

            if (user.role === "ALUNO") {
                fs.unlink(file?.path as string, (err) => {
                    console.log("Erro ao excluir arquivo")
                })
                next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
                return
            }

            if (!this.validator.validateFile(file)) {

                fs.unlink(file?.path as string, (err) => {
                    console.log("Erro ao excluir arquivo")
                })
                next(new ErrorResponse(9119, "Arquivo inválido", 500))
                return
            }

            if (!this.validator.validateEntity(type)) {
                fs.unlink(file?.path as string, (err) => {
                    console.log("Erro ao excluir arquivo")
                })
                next(new ErrorResponse(9119, "Entidade inválida para o arquivo", 500))
                return
            }

            // Success
            response.json({
                message: "Arquivo salvo com sucesso"
            })

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async readOne(request: Request, response: Response, next: NextFunction): Promise<void> {

        const type = request.query.type as string
        const id = request.query.id as string

        /**
         * Exemplo de query
         * https://api.agrocativo.com.br/api/course?type=course&id=b0d65aca-7501-4274-8e6b-f7d259c6385d
         */

        try {

            const params = [{ field: "id", value: id }]
            const entity = new CourseEntity(type, params, null, null, null, next)

            const course = await this.courseDatabase.readOne(entity)

            if (course instanceof Error) {
                next(new ErrorResponse(9111, course.message, 500))
                return
            }

            // Success
            response.json(course)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async readFullCourse(request: Request, response: Response, next: NextFunction): Promise<void> {

        const id = request.params.id as string
        const profile = response.locals.profile as string[]
        const role = response.locals.role as string
        const userId = response.locals.userId as string

        /**
         * Exemplo de query
         * https://api.agrocativo.com.br/api/course/full/course_module/b0d65aca-7501-4274-8e6b-f7d259c6385d
         */

        if (role !== "ALUNO") {
            next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
        }

        try {

            const course = await this.courseDatabase.readFullCourse(id, profile, userId)

            if (course instanceof Error) {
                next(new ErrorResponse(9111, course.message, 500))
                return
            }

            // Success
            response.json(course)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async readMultiple(request: Request, response: Response, next: NextFunction): Promise<void> {

        const params = request.body.params
        const type = request.body.type
        const orderBy = request.body.orderBy

        // Exemplo de body

        // {
        //     "params": [
        //         { field: "teacher_id", value: "2e33822d-30e7-43e9-9147-b3174b4b5098" }
        //     ],
        //     "type": "course",
        //     "orderBy": [
        //         { field: "name", sort: "asc" }
        //     ]
        // }

        try {

            const entity = new CourseEntity(type, params, null, orderBy, null, next)

            console.log(entity)

            const course = await this.courseDatabase.readMultiple(entity)

            if (course instanceof Error) {
                next(new ErrorResponse(9111, course.message, 500))
                return
            }

            // Success
            response.json(course)

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    public async create(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId
        const data = request.body.data
        const type = request.body.type

        // Exemplo de body

        // {
        //     "type": "course",
        //     "data": {
        //         "name": "Modelagem de Banco de Dados",
        //         "description": "Chega de passar trabalho na hora de modelar seu banco de dados. Conteúdo 100% prático e intuitivo",
        //         "duration": 20
        //     }
        // }

        try {

            const user = await this.userDatabase.readUser(userId)

            if (user instanceof Error) {
                next(new ErrorResponse(9119, user.message, 500))
                return
            }

            if (user.role === "ALUNO") {
                next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
                return
            }

            data.id = generateId()

            const entity = new CourseEntity(type, null, data, null, userId, next)

            console.log(entity)

            const createCourse = await this.courseDatabase.create(entity)

            if (createCourse instanceof Error) {
                next(new ErrorResponse(9121, createCourse.message, 500))
                return
            }

            if (type === 'course_classroom') {
                let dir = `public/file/${createCourse.id}`
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir)
                }
            }

            // Success
            response.json(createCourse)

        } catch (error: any) {

            next(new ErrorResponse(9132, error.message, 400))
        }
    }

    public async postCourseImage(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId
        const role = response.locals.role
        const course_id = request.params.id
        const image = request.file

        let errors: any = []

        if (!image || !this.validator.validateFile(image)) {
            next(new ErrorResponse(9124, "Imagem inválida", 400))
            return
        }

        // Compressão da imagem
        await compressImage(image, 600)
            .then((newfile: string) => {
                console.log("Upload e compressão realizados com sucesso!: " + newfile)
            })

        try {

            if (role === "ALUNO") {
                errors.push(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
            }

            const entity = new CourseEntity("course", [{ field: "id", value: course_id }], null, null, userId, next)

            const course = await this.courseDatabase.readOne(entity)

            if (course instanceof Error) {
                next(new ErrorResponse(9123, course.message, 500))
                return
            }

            if (!course) {
                next(new ErrorResponse(9123, "Curso não encontrado", 500))
                return
            }

            if (course && course.image && course.image !== "") {
                let path: string = course.image
                fs.unlink(path.replace(this.getUrl(request), ''), (err) => {
                    if (err) console.log(err)
                    console.log(path + ' - Arquivo deletado')
                })
            }

            if (errors.length > 0) {

                fs.unlink(image?.path as string, (err) => {
                    errors.push(err)
                })

                next(new ErrorResponse(9141, errors[0].message, 400))
                return
            }

            course.image = this.getUrl(request) + (image as any).path

            const updateCourse = new CourseEntity("course", [{ field: "id", value: course_id }], course, null, userId, next)

            await this.updateOne(updateCourse, response, next)


        } catch (error: any) {
            let path: string = image?.path as string
            fs.unlink(path, (err) => {
                if (err) throw err
                console.log(path + ' was deleted')
            })
            next(new ErrorResponse(9122, error.message, 500))
        }
    }

    public async update(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId
        const role = response.locals.role
        const id = request.params.id
        const type = request.body.type
        const data = request.body.data

        // Exemplo de body

        // {
        //     "type": "course",
        //     "data": {
        //         "name": "Modelagem de Banco de Dados",
        //         "description": "Chega de passar trabalho na hora de modelar seu banco de dados. Conteúdo 100% prático e intuitivo",
        //         "duration": 20
        //     }
        // }
        try {

            if (role === "ALUNO") {
                next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
                return
            }

            const entity = new CourseEntity(type, [{ field: "id", value: id }], null, null, userId, next)

            const course = await this.courseDatabase.readOne(entity)

            if (course instanceof Error) {
                next(new ErrorResponse(9129, course.message, 500))
                return
            }

            const entityUpdate = new CourseEntity(type, [{ field: "id", value: course.id }], data, null, userId, next)

            await this.updateOne(entityUpdate, response, next)


        } catch (error) {
            // Fails if no parameter is present
            next(new ErrorResponse(9132, "Parâmetros inválidos", 400))
        }


    }

    private async updateOne(entity: CourseEntity, response: Response, next: NextFunction): Promise<void> {

        try {
            const course = await this.courseDatabase.update(entity)

            if (course instanceof Error) {
                next(new ErrorResponse(9131, course.message, 500))
                return
            }

            // Success
            response.json(course)

        } catch (error: any) {
            next(new ErrorResponse(9122, error.message, 500))
        }
    }

    public async delete(request: Request, response: Response, next: NextFunction): Promise<void> {

        const userId = response.locals.userId
        const role = response.locals.role
        const type = request.params.type
        const id = request.params.id

        try {

            if (role === "ALUNO") {
                next(new ErrorResponse(9119, "Usuário sem permissão para acessar o recurso", 500))
                return
            }

            const entity = new CourseEntity(type, [{ field: "id", value: id }], null, null, null, next)

            console.log('Entity ->> ', entity)

            const course = await this.courseDatabase.readOne(entity)

            if (course instanceof Error) {
                next(new ErrorResponse(9129, course.message, 500))
                return
            }

            if (!course) {
                next(new ErrorResponse(9129, "Recurso não encontrado", 500))
                return
            }

            const deleteCourse = await this.courseDatabase.delete(entity)

            if (deleteCourse instanceof Error) {
                next(new ErrorResponse(9111, course.message, 500))
                return
            }

            // Deleta a pasta de arquivos 
            if (entity.type === 'course_classroom') {
                let folder = `public/file/${id}`
                if (fs.existsSync(folder)) {
                    fs.rmdir(folder, (err: any) => {
                        if (err) console.log(err)
                    })
                }
            }

            // Success
            response.json({ message: "Recurso excluído com sucesso" })

        } catch (error: any) {
            next(new ErrorResponse(9113, error.message, 500))
        }
    }

    private getUrl(request: Request): string {
        // return request.protocol + "://" + request.get("host") + "/"
        return process.env.BASE_URL || "https://api.agrocativo.com.br/"
    }


}
