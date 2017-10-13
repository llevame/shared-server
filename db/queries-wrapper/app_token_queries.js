var knex = require('../knex.js');

function AppTokens() {
	return knex('app-servers-tokens');
}

function add(serverId, tok) {
	
	return AppTokens().
		.insert({
			server_id: serverId,
			token:tok
		});
}

function getByServer(serverId) {
	
	return AppTokens()
		.where('server_id', serverId)
		.first('token');
}

function update(serverId, tok) {

	return AppTokens()
		.where('server_id', serverId)
		.update(tok)
		.returning('*');
}

module.exports = {add, getByServer, update};
