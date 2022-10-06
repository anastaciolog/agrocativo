exports.up = function (knex) {
	return Promise.all([
		knex.schema.table('tb_course', function (table) {
			table.foreign('teacher_id').references('tb_user.id')
		}),
		knex.schema.table('tb_course_module', function (table) {
			table.foreign('course_id').references('tb_course.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_classroom', function (table) {
			table.foreign('module_id').references('tb_course_module.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_step', function (table) {
			table.foreign('classroom_id').references('tb_course_classroom.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_lesson', function (table) {
			table.foreign('step_id').references('tb_course_step.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_lesson_option', function (table) {
			table.foreign('lesson_id').references('tb_course_lesson.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_session', function (table) {
			table.foreign('user_id').references('tb_user.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_lesson_comment', function (table) {
			table.foreign('user_id').references('tb_user.id')
			table.foreign('lesson_id').references('tb_course_lesson.id').onDelete('CASCADE')
		})
	])
}

exports.down = function (knex) {
	return Promise.all([
		knex.schema.table('tb_course', function (table) {
			table.dropForeign('teacher_id')
			table.dropForeign('student_id')
		}),
		knex.schema.table('tb_course_module', function (table) {
			table.dropForeign('course_id')
		}),
		knex.schema.table('tb_course_classroom', function (table) {
			table.dropForeign('module_id')
		}),
		knex.schema.table('tb_course_step', function (table) {
			table.dropForeign('classroom_id')
		}),
		knex.schema.table('tb_course_lesson', function (table) {
			table.dropForeign('step_id')
		}),
		knex.schema.table('tb_course_lesson_option', function (table) {
			table.dropForeign('lesson_id')
		}),
		knex.schema.table('tb_course_lesson_comment', function (table) {
			table.dropForeign('user_id')
			table.dropForeign('lesson_id')
		}),
		knex.schema.table('tb_session', function (table) {
			table.dropForeign('user')
		})
	])
}