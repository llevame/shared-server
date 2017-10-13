var knex = require('../knex.js');
var uuid = require('uuid/v4');

function Servers() {
	return knex('app_servers');
}


