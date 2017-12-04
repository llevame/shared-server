
exports.up = function(knex, Promise) {

	return knex.schema.alterTable('rules_commits', (table) => {
		table.string('rule', 1024).alter();
	});
};

exports.down = function(knex, Promise) {
};
