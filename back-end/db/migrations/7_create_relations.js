exports.up = function (knex) {
	return Promise.all([
		knex.schema.table('tb_course_lesson', function (table) {
			table.foreign('lesson_id').references('tb_course_step_lesson.id').onDelete('CASCADE')
		})
	])
}

exports.down = function (knex) {
	return Promise.all([
		knex.schema.table('tb_course_lesson', function (table) {
			table.dropForeign('lesson_id')
		})
	])
}