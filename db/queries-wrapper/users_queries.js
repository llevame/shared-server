var knex = require('../knex.js');
var uuid = require('uuid/v4');

function Users() {
	return knex('app_users');
}

// queries wrappers

function getAll() {

	return Users()
		.select('id',
			'_ref',
			'applicationOwner',
			'type',
			'cars',
			'username',
			'name',
			'surname',
			'country',
			'email',
			'birthdate',
			'images',
			'balance');
}

function get(id) {
	
	return Users()
		.where('id', parseInt(id))
		.first('id',
			'_ref',
			'applicationOwner',
			'type',
			'cars',
			'username',
			'name',
			'surname',
			'country',
			'email',
			'birthdate',
			'images',
			'balance');
}

function getByUsername(username) {

	return Users()
		.where('username', username)
		.first('id',
			'username',
			'password',
			'fb');
}

function del(id) {

	return Users()
		.where('id', parseInt(id))
		.del();
}

function update(id, updates) {

	let uaux = {
		_ref: uuid(),
		type: updates.type,
		username: updates.username,
		password: updates.password,
		fb: updates.fb,
		name: updates.firstName,
		surname: updates.lastName,
		country: updates.country,
		email: updates.email,
		birthdate: updates.birthdate,
		images: updates.images
	};

	return Users()
		.where('id', parseInt(id))
		.update(uaux)
		.returning('*');
}

function add(u) {

	let uaux = {
		_ref: uuid(),
		type: u.type,
		username: u.username,
		password: u.password,
		fb: u.fb,
		name: u.firstName,
		surname: u.lastName,
		country: u.country,
		email: u.email,
		birthdate: u.birthdate,
		images: u.images
	};

	return Users()
		.insert(uaux, 'id');
}

module.exports = {getAll, get, add, update, del, getByUsername};
