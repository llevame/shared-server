
exports.up = function(knex, Promise) {

	return knex.schema.createTableIfNotExists('rules_commits', (table) => {
		table.increments();
		table.string('message').notNullable();
		table.string('rule');
		table.integer('rule_id');
		table.specificType('author', 'json');
		table.timestamp('timestamp').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex, Promise) {

	return knex.schema.dropTableIfExists('rules_commits');
};
