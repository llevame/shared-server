
exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('business_users', (table) => {
		table.increments();
		table.string('_ref').notNullable();
		table.string('username').notNullable();
		table.string('password').notNullable();
		table.string('name').notNullable();
		table.string('surname').notNullable();
		table.specificType('roles', 'text[]').notNullable();
	});
};

exports.down = function(knex, Promise) {
	
	return knex.schema.dropTableIfExists('business_users');
};
