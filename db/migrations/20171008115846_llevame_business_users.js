
exports.up = function(knex, Promise) {
	
	return knex.schema.createTable('business_users', (table) => {
		table.increments();
		table.string('username').notNullable().unique();
		table.string('password').notNullable().unique();
		table.string('name').notNullable();
		table.string('surname').notNullable();
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTable('business_users');
};
