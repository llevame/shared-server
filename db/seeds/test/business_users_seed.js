var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {
	
	// Deletes ALL existing entries
	return knex('business_users').del()
		.then(() => {
			return knex('business_users').insert({
				_ref: uuid(),
				username: 'juan123',
				password: '123',
				name: 'juan',
				surname: 'lopez',
				roles: ["admin"]
			});
		}).then(() => {
			return knex('business_users').insert({
				_ref: uuid(),
				username: 'eduardo123',
				password: '456',
				name: 'eduardo',
				surname: 'garcia',
				roles: ["admin", "manager"]
			});
		}).then(() => {
			return knex('business_users').insert({
				_ref: uuid(),
				username: 'gerardo123',
				password: '789',
				name: 'gerardo',
				surname: 'lopez',
				roles: ["user"]
			});
		}).then(() => {
			return knex('business_users').insert({
				_ref: uuid(),
				username: 'federico123',
				password: '345',
				name: 'federico',
				surname: 'garcia',
				roles: ["manager"]
			});
		});
};
