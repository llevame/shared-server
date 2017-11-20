var knex = require('../knex.js');

function Commits() {
	return knex('rules_commits');
}

function get(id) {
	
	return Commits()
		.where('id', parseInt(id))
		.first();
}

function add(commit) {
	
	return Commits()
		.insert(commit, 'id');
}

function getAllOfRule(ruleId) {
	
	return Commits()
		.select()
		.where('rule_id', parseInt(ruleId));
}

module.exports = {get, add, getAllOfRule};