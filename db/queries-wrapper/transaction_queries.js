var knex = require('../knex.js');

function Transacions() {
	return knex('transactions');
}

function getAllOfUser(userId) {

	return Transacions()
		.where('user_id', parseInt(userId))
		.select('id',
			'trip',
			'timestamp',
			'cost',
			'description',
			'data');
}

function get(id) {

	return Transacions()
		.where('id', parseInt(id))
		.first('id',
			'trip',
			'timestamp',
			'cost',
			'description',
			'data');
}

function getLast(userId) {

	return Transacions()
		.max('timestamp')
		.where('user_id', userId);
}

function getByTimestamp(ts) {

	return Transacions()
		.where('timestamp', ts);
}

function addTransactionTrip(userId, tripId, cost, trip) {

	let taux = {
		user_id: parseInt(userId),
		trip: tripId,
		cost: cost,
		timestamp: knex.fn.now(),
		description: tripId,
	};

	return Transacions()
		.insert(taux, 'id');
}

module.exports = {addTransactionTrip, get,
				getLast, getByTimestamp,
				getAllOfUser};
