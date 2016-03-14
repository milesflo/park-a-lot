exports.up = function(knex, Promise) {
  return knex.schema.createTable('queue', function(table){
    table.increments();
    table.string("query");
    table.boolean("done");
  });
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('queue');  
};