exports.up = function (knex) {
	return Promise.all([
		knex.schema.table('tb_course_reply', function (table) {
			table.foreign('course_id').references('tb_course.id').onDelete('CASCADE')
			table.foreign('student_id').references('tb_user.id').onDelete('CASCADE')
		})
	])
}

exports.down = function (knex) {
	return Promise.all([
		knex.schema.table('tb_course_reply', function (table) {
			table.dropForeign('course_id')
			table.dropForeign('student_id')
		})
	])
}