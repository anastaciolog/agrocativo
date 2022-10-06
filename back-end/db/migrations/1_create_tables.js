exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('tb_user', function (table) {
      table.string('id').notNullable().primary()
      table.string('fullname').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('cpf').defaultTo(null)
      table.string('birthday').defaultTo(null)
      table.string('about').defaultTo(null)
      table.string('phone').defaultTo(null)
      table.boolean('active').notNullable().defaultTo(true)
      table.boolean('confirmed').notNullable().defaultTo(false)
      table.string('confirmation_code')
      table.string('image').defaultTo(null)
      table.string('role').notNullable()
      table.specificType('courses', 'text[]')
      table.specificType('profile', 'text[]')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('deleted_at').defaultTo(null)
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
CREATE OR REPLACE FUNCTION tb_user_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW."updated_at"=now(); 
RETURN NEW;
END;
$$ language 'plpgsql';
`)
      .raw(`
CREATE TRIGGER tb_user_updated_at BEFORE UPDATE
ON ?? FOR EACH ROW EXECUTE PROCEDURE 
tb_user_updated_at_column();
`, ['tb_user']
      ),
    knex.schema.createTable('tb_course', function (table) {
      table.string('id').notNullable().primary()
      table.string('teacher_id').notNullable()
      table.string('name').notNullable()
      table.integer('duration').notNullable()
      table.text('description').notNullable()
      table.string('image').defaultTo(null)
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
CREATE OR REPLACE FUNCTION tb_course_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW."updated_at"=now(); 
RETURN NEW;
END;
$$ language 'plpgsql';
`)
      .raw(`
CREATE TRIGGER tb_course_updated_at BEFORE UPDATE
ON ?? FOR EACH ROW EXECUTE PROCEDURE 
tb_course_updated_at_column();
`, ['tb_course']
      ),
    knex.schema.createTable('tb_course_module', function (table) {
      table.string('id').notNullable().primary()
      table.string('course_id').notNullable()
      table.string('name').notNullable()
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())

    }).raw(`
CREATE OR REPLACE FUNCTION tb_course_module_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW."updated_at"=now(); 
RETURN NEW;
END;
$$ language 'plpgsql';
`)
      .raw(`
CREATE TRIGGER tb_course_module_updated_at BEFORE UPDATE
ON ?? FOR EACH ROW EXECUTE PROCEDURE 
tb_course_module_updated_at_column();
`, ['tb_course_module']
      ),
    knex.schema.createTable('tb_course_classroom', function (table) {
      table.string('id').notNullable().primary()
      table.string('module_id').notNullable()
      table.string('name').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())

    }).raw(`
  CREATE OR REPLACE FUNCTION tb_course_classroom_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
  NEW."updated_at"=now(); 
  RETURN NEW;
  END;
  $$ language 'plpgsql';
  `)
      .raw(`
  CREATE TRIGGER tb_course_classroom_updated_at BEFORE UPDATE
  ON ?? FOR EACH ROW EXECUTE PROCEDURE 
  tb_course_classroom_updated_at_column();
  `, ['tb_course_classroom']
      ),
    knex.schema.createTable('tb_course_step', function (table) {
      table.string('id').notNullable().primary()
      table.string('classroom_id').notNullable()
      table.string('name').notNullable()
      table.specificType('movie', 'text[]')
      table.specificType('image', 'text[]')
      table.specificType('audio', 'text[]')
      table.specificType('document', 'text[]')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
  CREATE OR REPLACE FUNCTION tb_course_step_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
  NEW."updated_at"=now(); 
  RETURN NEW;
  END;
  $$ language 'plpgsql';
  `)
      .raw(`
  CREATE TRIGGER tb_course_step_updated_at BEFORE UPDATE
  ON ?? FOR EACH ROW EXECUTE PROCEDURE 
  tb_course_step_updated_at_column();
  `, ['tb_course_step']
      ),
    knex.schema.createTable('tb_session', function (table) {
      table.string('id').notNullable().primary()
      table.string('user_id').notNullable()
      table.string('token').notNullable()
      table.string('platform')
      table.string('deviceId').unique()
      table.timestamp('startedOn').notNullable()
      table.timestamp('lastInteraction').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())

    }).raw(`
CREATE OR REPLACE FUNCTION tb_session_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW."updated_at"=now(); 
RETURN NEW;
END;
$$ language 'plpgsql';
`)
      .raw(`
CREATE TRIGGER tb_session_updated_at BEFORE UPDATE
ON ?? FOR EACH ROW EXECUTE PROCEDURE 
tb_session_updated_at_column();
`, ['tb_session']
      ),
    knex.schema.createTable('tb_course_lesson', function (table) {
      table.string('id').notNullable().primary()
      table.string('step_id').notNullable()
      table.string('description').notNullable()
      table.boolean('public').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
CREATE OR REPLACE FUNCTION tb_course_lesson_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW."updated_at"=now(); 
RETURN NEW;
END;
$$ language 'plpgsql';
`)
      .raw(`
CREATE TRIGGER tb_course_lesson_updated_at BEFORE UPDATE
ON ?? FOR EACH ROW EXECUTE PROCEDURE 
tb_course_lesson_updated_at_column();
`, ['tb_course_lesson']
      ),
    knex.schema.createTable('tb_course_lesson_option', function (table) {
      table.string('id').notNullable().primary()
      table.string('lesson_id').notNullable()
      table.string('description').notNullable()
      table.boolean('correct').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
CREATE OR REPLACE FUNCTION tb_course_lesson_option_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW."updated_at"=now(); 
RETURN NEW;
END;
$$ language 'plpgsql';
`)
      .raw(`
CREATE TRIGGER tb_course_lesson_option_updated_at BEFORE UPDATE
ON ?? FOR EACH ROW EXECUTE PROCEDURE 
tb_course_lesson_option_updated_at_column();
`, ['tb_course_lesson_option']
      ),
    knex.schema.createTable('tb_course_lesson_comment', function (table) {
      table.string('id').notNullable().primary()
      table.string('lesson_id').notNullable()
      table.string('user_id').notNullable()
      table.string('content').notNullable()
      table.specificType('upvote', 'text[]')
      table.specificType('downvote', 'text[]')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())

    }).raw(`
CREATE OR REPLACE FUNCTION tb_course_lesson_comment_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW."updated_at"=now(); 
RETURN NEW;
END;
$$ language 'plpgsql';
`)
      .raw(`
CREATE TRIGGER tb_course_lesson_comment_updated_at BEFORE UPDATE
ON ?? FOR EACH ROW EXECUTE PROCEDURE 
tb_course_lesson_comment_updated_at_column();
`, ['tb_course_lesson_comment']
      ),
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('tb_user'),
    knex.schema.dropTableIfExists('tb_course'),
    knex.schema.dropTableIfExists('tb_course_module'),
    knex.schema.dropTableIfExists('tb_course_classroom'),
    knex.schema.dropTableIfExists('tb_course_step'),
    knex.schema.dropTableIfExists('tb_course_lesson'),
    knex.schema.dropTableIfExists('tb_course_lesson_option'),
    knex.schema.dropTableIfExists('tb_course_lesson_comment'),
    knex.schema.dropTableIfExists('tb_session'),
    knex.raw(`
            CREATE OR REPLACE FUNCTION strip_all_triggers() RETURNS text AS $$ DECLARE
            triggNameRecord RECORD;
            triggTableRecord RECORD;
        BEGIN
            FOR triggNameRecord IN select distinct(trigger_name) from information_schema.triggers where trigger_schema = 'public' LOOP
                FOR triggTableRecord IN SELECT distinct(event_object_table) from information_schema.triggers where trigger_name = triggNameRecord.trigger_name LOOP
                    RAISE NOTICE 'Dropping trigger: % on table: %', triggNameRecord.trigger_name, triggTableRecord.event_object_table;
                    EXECUTE 'DROP TRIGGER ' || triggNameRecord.trigger_name || ' ON ' || triggTableRecord.event_object_table || ';';
                END LOOP;
            END LOOP;

            RETURN 'done';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        select strip_all_triggers();
    `)
  ])
}
