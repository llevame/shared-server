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

function addTransactionTrip(userId, tripId, cost, trip, desc) {

	let taux = {
		user_id: parseInt(userId),
		trip: tripId,
		cost: cost,
		timestamp: knex.fn.now(),
		description: desc,
	};

	return Transacions()
		.insert(taux, 'id');
}

module.exports = {addTransactionTrip, get, getAllOfUser};
