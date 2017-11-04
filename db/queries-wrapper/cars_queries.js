var knex = require('../knex.js');
var uuid = require('uuid/v4');

function Cars() {
	return knex('cars');
}

function getAll() {

	return Cars().select();
}

function getAllOfUser(userId) {

	return Cars()
		.select()
		.where('owner', userId.toString());
}

function get(userId, carId) {

	return Cars()
		.where('id', parseInt(carId))
		.first();
}

function add(userId, car) {

	let caux = {
		_ref: uuid(),
		owner: userId.toString(),
		properties: car.properties
	};

	return Cars()
		.insert(caux, 'id');
}

function update(userId, carId, updates) {

	let caux = {
		_ref: uuid(),
		owner: userId.toString(),
		properties: updates.properties
	};

	return Cars()
		.where('id', parseInt(carId))
		.update(caux)
		.returning('*');
}

function del(userId, carId) {

	return Cars()
		.where('id', parseInt(carId))
		.del();
}

function delAllOfUser(userId) {

	return Cars()
		.where('owner', userId.toString())
		.del();
}

module.exports = {getAll, getAllOfUser, get, add, update, del, delAllOfUser};

