var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('rules').del()
		.then(() => {
			return knex('rules').insert({
				_ref: uuid(),
				blob: '{"rule":"rule"}',
				author: {
						id: 1,
						_ref: uuid(),
						username: 'juan123',
						password: '123',
						name: 'juan',
						surname: 'lopez',
						roles: ["admin"]
				},
				message: 'Create new rule',
				timestamp: knex.fn.now(),
				active: true
			});
		}).then(() => {
			return knex('rules').insert({
				_ref: uuid(),
				blob: '{"rule":"rule"}',
				author: {
					id: 2,
					_ref: uuid(),
					username: 'eduardo123',
					password: '456',
					name: 'eduardo',
					surname: 'garcia',
					roles: ["admin", "manager"]
				},
				message: 'Create new rule',
				timestamp: knex.fn.now(),
				active: true
			});
		});
};
