
exports.up = function(knex, Promise) {

	return knex.schema.createTable('cars', (table) => {
		table.increments();
		table.string('_ref').notNullable();
		table.string('owner');
		table.specificType('properties', 'json[]');
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('cars');
};
