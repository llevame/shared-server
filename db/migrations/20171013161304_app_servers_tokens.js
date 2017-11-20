
exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('app_servers_tokens', (table) => {
		table.integer('server_id');
		table.string('token');
	})
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('app_servers_tokens');
};
