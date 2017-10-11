var knex = require('../knex.js');

function Trips() {
	return knex('trips');
}

function getAll() {
	
	return Trips()
		.select('id',
			'applicationOwner',
			'driver',
			'passenger',
			'start',
			'end',
			'waitTime',
			'travelTime',
			'distance',
			'route',
			'cost');
}

function get(id) {

	return Trips()
		.where('id', parseInt(id))
		.first();
}

function add(t) {

	return Trips()
		.insert(t, 'id');
}

function getAllByUser(id) {

	return Trips()
		.where('user_id', id)
		.select();
}

module.exports = {getAll, getAllByUser, add, get};
