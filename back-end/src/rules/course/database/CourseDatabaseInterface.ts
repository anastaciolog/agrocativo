
import { CourseEntity } from "../models/Course"

export interface CourseDatabaseInterface {

	create(entity: CourseEntity): Promise<any | Error>
	readOne(entity: CourseEntity): Promise<any | Error>
	update(entity: CourseEntity): Promise<any | Error>
	delete(entity: CourseEntity): Promise<any | Error>	

	voteComment(comment_id: string, user_id: string, type: string): Promise<any | Error>
	readComments(tasks: string[]): Promise<any | Error>

	feedback(course_id: string, content: string): Promise<any | Error>

	readClassroom(id: string): Promise<any | Error>
	readFullCourse(id: string, profile: string[], user_id: string): Promise<any | Error>
	readSubmitCourses(teacher_id: string): Promise<any[] | Error>
	readStudentsByCourse(teacher_id: string): Promise<any[] | Error>
	getCertificate(course_reply_id: string): Promise<any | Error>
	checkResult(reply: any): Promise<any | Error>
	checkReplyCourse(course_id: string, user_id: string): Promise<any | Error>
	readMultiple(entity: CourseEntity): Promise<any[] | Error>


}
