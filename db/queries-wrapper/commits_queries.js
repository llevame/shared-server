var knex = require('../knex.js');

function Commits() {
	return knex('rules_commits');
}

function add(commit) {
	
	return Commits()
		.insert(commit, 'id');
}

module.exports = {add};