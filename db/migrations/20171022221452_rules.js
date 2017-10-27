
exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('rules', (table) => {
		table.increments('id').unsigned().primary();
		table.string('_ref').notNullable();
		table.string('blob');
		table.specificType('author', 'json');
		table.string('message');
		table.timestamp('timestamp');
		table.boolean('active');
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('rules');
};
