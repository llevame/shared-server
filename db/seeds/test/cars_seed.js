var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('cars').del()
		.then(() => {
			return knex('cars').insert({
				_ref: uuid(),
				owner: '1',
				properties: [
					{
						name: 'color',
						value: 'verde'
					}
				]
			});
		}).then(() => {
			return knex('cars').insert({
				_ref: uuid(),
				owner: '1',
				properties: [
					{
						name: 'color',
						value: 'negro'
					}
				]
			});
		});
};
