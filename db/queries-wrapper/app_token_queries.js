var knex = require('../knex.js');

function AppTokens() {
	return knex('app_servers_tokens');
}

function add(serverId, tok) {
	
	return AppTokens()
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

	let app_token = {
		token: tok
	};

	return AppTokens()
		.where('server_id', serverId)
		.update(app_token)
		.returning('*');
}

module.exports = {add, getByServer, update};
