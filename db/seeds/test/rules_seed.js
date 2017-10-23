var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('rules').del()
		.then(() => {
			return knex('rules').insert({
				_ref: uuid(),
				active: true,
				description: 'A test description on active rule.',
				rule: '{rule}'
			});
		}).then(() => {
			return knex('rules').insert({
				_ref: uuid(),
				active: false,
				description: 'A test description on inactive rule.',
				rule: '{rule}'
			});
		});
};
