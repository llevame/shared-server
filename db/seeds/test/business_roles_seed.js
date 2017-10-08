
exports.seed = function(knex, Promise) {
	
	// Deletes ALL existing entries
	return knex('business_roles').del()
		.then(() => {
			return knex('business_roles').insert({
				id: 1,
				rol: 'admin'
			});
		}).then(() => {
			return knex('business_roles').insert({
				id: 2,
				rol: 'manager'
			});
		}).then(() => {
			return knex('business_roles').insert({
				id: 3,
				rol: 'user'
			});
		}).then(() => {
			return knex('business_roles').insert({
				id: 4,
				rol: 'admin'
			});
		}).then(() => {
			return knex('business_roles').insert({
				id: 4,
				rol: 'manager'
			});
		});
};
