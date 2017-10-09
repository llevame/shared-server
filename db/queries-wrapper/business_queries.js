var knex = require('../knex.js');
var uuid = require('uuid/v4');

function BusinessUsers() {
	return knex('business_users');
}

// queries wrappers

function getAll() {

	return BusinessUsers().select();
}

function getBusinessUser(userId) {

	return BusinessUsers()
		.where('id', parseInt(userId))
		.first();
}

function updateBusinessUser(id, updates) {

	let buaux = {
		_ref: uuid(),
		username: updates.username,
		password: updates.password,
		name: updates.name,
		surname: updates.surname,
		roles: updates.roles
	};

	return BusinessUsers()
		.where('id', parseInt(id))
		.update(buaux)
		.returning('*');
}

function addBusinessUser(bu) {
	
	let buaux = {
		_ref: uuid(),
		username: bu.username,
		password: bu.password,
		name: bu.name,
		surname: bu.surname,
		roles: bu.roles
	};

	return BusinessUsers().insert(buaux, 'id');
}

module.exports = {getAll, getBusinessUser, addBusinessUser, updateBusinessUser};

