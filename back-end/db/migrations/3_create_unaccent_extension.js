
exports.up = function(knex) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS unaccent')
    .then(function () {
      // set up tables
    });
};

exports.down = function(knex) {
  return knex.raw('DROP EXTENSION unaccent')
    .then(function () {
      // set up tables
    });
};
