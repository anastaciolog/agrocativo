exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('tb_course_reply', function (table) {
      table.string('id').notNullable().primary()
      table.string('course_id').notNullable()
      table.string('student_id').notNullable()
      table.text('new_content_reply').notNullable()
      table.text('lesson_reply').notNullable()
      table.integer('rate')
      table.string('feedback')
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    }).raw(`
  CREATE OR REPLACE FUNCTION tb_course_reply_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
  NEW."updated_at"=now(); 
  RETURN NEW;
  END;
  $$ language 'plpgsql';
  `)
      .raw(`
  CREATE TRIGGER tb_course_reply_updated_at BEFORE UPDATE
  ON ?? FOR EACH ROW EXECUTE PROCEDURE 
  tb_course_reply_updated_at_column();
  `, ['tb_course_reply']
      )
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('tb_course_reply'),
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



// {
//   id_student: string,
//     id_course: string,
//     id_module: string,
//     id_classroom: string,
//       reply: {
//     new_content: [
//       {
//         id_option: string,
//         reply: string
//       }
//     ],
//       lesson : [
//         {
//           id_option: string,
//           reply: string
//         }
//       ]
//   }

// }