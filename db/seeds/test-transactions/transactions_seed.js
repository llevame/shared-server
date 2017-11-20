exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('transactions').del()
		.then(() => {
			return knex('transactions').insert({
				trip: '1',
				cost: {
					currency: 'ARS',
					value: -97.5
				},
				description: 'Passenger transaction',
				user_id: 1
			});
		})
		.then(() => {
			return knex('transactions').insert({
				trip: '1',
				cost: {
					currency: 'ARS',
					value: 80
				},
				description: 'Driver transaction',
				user_id: 2
			});
		});
};
