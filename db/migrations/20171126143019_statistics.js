
exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('statistics', (table) => {
		table.integer('app_id');
		table.string('endpoint', 1024);
		table.string('method');
		table.integer('madeTime');
		table.integer('count').defaultTo(1);
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('statistics');
};
