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

function add(t, cst, curr) {

	let taux = {
		driver: t.trip.driver,
		passenger: t.trip.passenger,
		start: t.trip.start,
		end: t.trip.end,
		waitTime: t.trip.waitTime,
		travelTime: t.trip.travelTime,
		distance: t.trip.distance,
		route: t.trip.route,
		cost: {
			currency: curr,
			value: cst
		},
		paymethod: t.paymethod
	};

	return Trips()
		.insert(taux, 'id');
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
