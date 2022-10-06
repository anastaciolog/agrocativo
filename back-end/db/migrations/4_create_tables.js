exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('tb_course_step_intro', function (table) {
      table.string('id').notNullable().primary()
      table.string('classroom_id').notNullable()
      table.text('description').notNullable()
      table.specificType('file', 'text[]')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
  CREATE OR REPLACE FUNCTION tb_course_step_intro_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
  NEW."updated_at"=now(); 
  RETURN NEW;
  END;
  $$ language 'plpgsql';
  `)
      .raw(`
  CREATE TRIGGER tb_course_step_intro_updated_at BEFORE UPDATE
  ON ?? FOR EACH ROW EXECUTE PROCEDURE 
  tb_course_step_intro_updated_at_column();
  `, ['tb_course_step_intro']
      ),
    knex.schema.createTable('tb_course_step_new_content', function (table) {
      table.string('id').notNullable().primary()
      table.string('classroom_id').notNullable()
      table.text('description').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
    CREATE OR REPLACE FUNCTION tb_course_step_new_content_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
    NEW."updated_at"=now(); 
    RETURN NEW;
    END;
    $$ language 'plpgsql';
    `)
      .raw(`
    CREATE TRIGGER tb_course_step_new_content_updated_at BEFORE UPDATE
    ON ?? FOR EACH ROW EXECUTE PROCEDURE 
    tb_course_step_new_content_updated_at_column();
    `, ['tb_course_step_new_content']
      ),
    knex.schema.createTable('tb_course_step_library', function (table) {
      table.string('id').notNullable().primary()
      table.string('classroom_id').notNullable()
      table.text('description').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
      CREATE OR REPLACE FUNCTION tb_course_step_library_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
      NEW."updated_at"=now(); 
      RETURN NEW;
      END;
      $$ language 'plpgsql';
      `)
      .raw(`
      CREATE TRIGGER tb_course_step_library_updated_at BEFORE UPDATE
      ON ?? FOR EACH ROW EXECUTE PROCEDURE 
      tb_course_step_library_updated_at_column();
      `, ['tb_course_step_library']
      ),
    knex.schema.createTable('tb_course_step_lesson', function (table) {
      table.string('id').notNullable().primary()
      table.string('classroom_id').notNullable()
      table.text('description').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
        CREATE OR REPLACE FUNCTION tb_course_step_lesson_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
        NEW."updated_at"=now(); 
        RETURN NEW;
        END;
        $$ language 'plpgsql';
        `)
      .raw(`
        CREATE TRIGGER tb_course_step_lesson_updated_at BEFORE UPDATE
        ON ?? FOR EACH ROW EXECUTE PROCEDURE 
        tb_course_step_lesson_updated_at_column();
        `, ['tb_course_step_lesson']
      ),
    knex.schema.createTable('tb_course_new_content_option', function (table) {
      table.string('id').notNullable().primary()
      table.string('new_content_id').notNullable()
      table.text('description').notNullable()
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
        CREATE OR REPLACE FUNCTION tb_course_new_content_option_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
        NEW."updated_at"=now(); 
        RETURN NEW;
        END;
        $$ language 'plpgsql';
        `)
      .raw(`
        CREATE TRIGGER tb_course_new_content_option_updated_at BEFORE UPDATE
        ON ?? FOR EACH ROW EXECUTE PROCEDURE 
        tb_course_new_content_option_updated_at_column();
        `, ['tb_course_new_content_option']
      ),
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('tb_course_step_intro'),
    knex.schema.dropTableIfExists('tb_course_step_new_content'),
    knex.schema.dropTableIfExists('tb_course_step_library'),
    knex.schema.dropTableIfExists('tb_course_step_lesson'),
    knex.schema.dropTableIfExists('tb_course_new_content_option'),
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
