
exports.up = function(knex, Promise) {

	return knex.schema.createTable('business_roles', (table) => {
		table.integer('id').notNullable();
		table.string('rol').notNullable();
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTable('business_roles');
};
