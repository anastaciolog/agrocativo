exports.up = function (knex) {
	return Promise.all([

		knex.schema.table('tb_course_step_intro', function (table) {
			table.foreign('classroom_id').references('tb_course_classroom.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_step_new_content', function (table) {
			table.foreign('classroom_id').references('tb_course_classroom.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_step_library', function (table) {
			table.foreign('classroom_id').references('tb_course_classroom.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_step_lesson', function (table) {
			table.foreign('classroom_id').references('tb_course_classroom.id').onDelete('CASCADE')
		}),
		knex.schema.table('tb_course_new_content_option', function (table) {
			table.foreign('new_content_id').references('tb_course_step_new_content.id').onDelete('CASCADE')
		})
	])
}


exports.down = function (knex) {
	return Promise.all([

		knex.schema.table('tb_course_step_intro', function (table) {
			table.dropForeign('classroom_id')
		}),
		knex.schema.table('tb_course_step_new_content', function (table) {
			table.dropForeign('classroom_id')
		}),
		knex.schema.table('tb_course_step_library', function (table) {
			table.dropForeign('classroom_id')
		}),
		knex.schema.table('tb_course_step_lesson', function (table) {
			table.dropForeign('classroom_id')
		}),
		knex.schema.table('tb_course_new_content_option', function (table) {
			table.dropForeign('new_content_id')
		})
	])
}