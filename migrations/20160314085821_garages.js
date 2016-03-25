exports.up = function(knex, Promise) {
  return knex.schema.createTable('garages', function(table){
    table.increments('id');
    table.string('garageId');
    table.string('garageName');
    table.string('latitude');
    table.string('longitude');
    table.json('garageJson');
    table.timestamp("invalidateAt");
  });
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('garages');  
};
