var knex = require('../knex.js');

function InvalidTokens() {
	return knex('invalid_server_tokens');
}

function add(tok) {

	return InvalidTokens()
		.insert({token: tok});
}

module.exports = {add};
