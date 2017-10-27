
exports.up = function(knex, Promise) {
	return knex.schema.createTableIfNotExists('rules', (table) => {
		table.increments('id').unsigned().primary();
		table.specificType('rule', 'json').notNullable();
		table.string('description').notNullable();
		table.boolean('active').notNullable();
	});  
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTableIfExists('rules');
};
