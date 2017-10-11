var knex = require('../knex.js');
var uuid = require('uuid/v4');

function Cars() {
	return knex('cars');
}

function getAll() {

	return Cars().select();
}

function getAllOfUser(userId) {

	return Cars().select().where('owner', userId.toString());
}

function get(userId, carId) {
}

function add(userId, car) {
}

function update(userId, carId, updates) {
}

function del(userId, carId) {
}

module.exports = {getAll, getAllOfUser, get, add, update, del};

