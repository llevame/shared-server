exports.up = function(knex, Promise) {

    return knex.schema.table('rules', function(t) {
	t.string('_ref').notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('rules', function(t) {
        t.dropColumn('_ref');
    });
};
