var knex = require('../knex.js');
var uuid = require('uuid/v4');

function Servers() {
	return knex('app_servers');
}

function getAll() {

	return Servers().select();
}

function get(id) {

	return Servers()
		.where('id', parseInt(id))
		.first();
}

function add(server) {

	let serveraux = {
		_ref: uuid(),
		createdBy: server.createdBy,
		createdTime: server.createdTime,
		name: server.name
	};

	return Servers()
		.insert(serveraux, 'id');
}

function del(id) {

	return Servers()
		.where('id', parseInt(id))
		.del();
}

function update(id, update) {
	
	let srvaux = {
		_ref: uuid(),
		name: update.name
	};

	return Servers()
		.where('id', parseInt(id))
		.update(srvaux)
		.returning('*');
}

function updatePing(id, update) {
	
	let s = {
		_ref: uuid(),
		lastConnection: update.lastConnection
	};

	return Servers()
		.where('id', parseInt(id))
		.update(s)
		.returning('*');
}

module.exports = {getAll, get, add, del, update, updatePing};

