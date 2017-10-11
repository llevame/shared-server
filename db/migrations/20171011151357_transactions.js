
exports.up = function(knex, Promise) {

	return knex.schema.createTable('transactions', (table) => {
		table.increments();
		table.string('trip');
		table.timestamp('timestamp').defaultTo(knex.fn.now());
		table.specificType('cost', 'json');
		table.string('description');
		table.specificType('data', 'json');
		table.integer('user_id');
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('transactions');
};
