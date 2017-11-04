
exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('invalid_server_tokens', (table) => {
		table.string('token');
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('invalid_server_tokens');
};
