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

function getAllByUser(username) {

	return Trips()
		.where('passenger', username)
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

module.exports = {getAll, getAllByUser, add, get};
