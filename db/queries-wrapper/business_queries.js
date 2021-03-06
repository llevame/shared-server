var knex = require('../knex.js');
var uuid = require('uuid/v4');

function BusinessUsers() {
	return knex('business_users');
}

// queries wrappers

function getAll() {

	return BusinessUsers().select();
}

function get(id) {

	return BusinessUsers()
		.where('id', parseInt(id))
		.first();
}

function getByUsername(username) {

	return BusinessUsers()
		.where('username', username)
		.first('id',
			'username',
			'password',
			'roles');
}

function del(id) {

	return BusinessUsers()
		.where('id', parseInt(id))
		.del();
}

function update(id, updates) {

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

function add(bu) {
	
	let buaux = {
		_ref: uuid(),
		username: bu.username,
		password: bu.password,
		name: bu.name,
		surname: bu.surname,
		roles: bu.roles
	};

	return BusinessUsers()
		.insert(buaux, 'id');
}

module.exports = {getAll, get, getByUsername, add, update, del};

