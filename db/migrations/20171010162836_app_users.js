exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('app_users', (table) => {
		table.increments();
		table.string('_ref').notNullable();
		table.string('applicationOwner');
		table.string('type').notNullable();
		table.string('username').notNullable().unique();
		table.string('name').notNullable();
		table.string('surname').notNullable();
		table.string('country').notNullable();
		table.string('email').notNullable();
		table.string('birthdate').notNullable();
		table.specificType('images', 'text[]');
		table.specificType('balance', 'json[]');
		table.string('password');
		table.specificType('fb', 'json');
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('app_users');
};
