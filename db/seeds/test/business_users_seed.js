
exports.seed = function(knex, Promise) {
	
	// Deletes ALL existing entries
	return knex('business_users').del()
		.then(() => {
			return knex('business_users').insert({
				username: 'juan123',
				password: '123',
				name: 'juan',
				surname: 'lopez'
			});
		}).then(() => {
			return knex('business_users').insert({
				username: 'eduardo123',
				password: '456',
				name: 'eduardo',
				surname: 'garcia'
			});
		}).then(() => {
			return knex('business_users').insert({
				username: 'gerardo123',
				password: '789',
				name: 'gerardo',
				surname: 'lopez'
			});
		}).then(() => {
			return knex('business_users').insert({
				username: 'federico123',
				password: '345',
				name: 'federico',
				surname: 'garcia'
			});
		});
};
