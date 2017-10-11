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
		fisrt('id',
			'trip',
			'timestamp',
			'cost',
			'description',
			'data');
}

function add(userId) {

	let taux = {
		user_id: parseInt(userId)
	};

	return Transacions()
		.insert(taux, 'id');
}

module.exports = {add, get, getAllOfUser};
