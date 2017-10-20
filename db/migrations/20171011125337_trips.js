
exports.up = function(knex, Promise) {
	
	return knex.schema.createTable('trips', (table) => {
		table.increments();
		table.string('applicationOwner');
		table.string('driver');
		table.string('passenger');
		table.specificType('start', 'json');
		table.specificType('end', 'json');
		table.integer('waitTime');
		table.integer('travelTime');
		table.integer('distance');
		table.specificType('route', 'json[]');
		table.specificType('cost', 'json');
		table.specificType('paymethod', 'json');
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('trips');
};
