
exports.up = function(knex, Promise) {

	return knex.schema.createTable('app_servers', (table) => {
		table.increments();
		table.string('_ref').notNullable();
		table.string('createdBy');
		table.integer('createdTime');
		table.string('name');
		table.timestamp('lastConnection').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex, Promise) {
	
	return knex.schema.dropTableIfExists('app_servers');
};
