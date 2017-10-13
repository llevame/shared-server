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

module.exports = {getAll, get, add};
