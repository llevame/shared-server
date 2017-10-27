
exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('rules', (table) => {
		table.increments('id').unsigned().primary();
		table.string('_ref').notNullable();
		table.string('blob');
		table.specificType('lastCommit', 'json');
		table.boolean('active');
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('rules');
};
