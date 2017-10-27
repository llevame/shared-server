var knex = require('../knex.js');
var uuid = require('uuid/v4');

function Rules() {
	return knex('rules');
}

function getAll() {

	return Rules().select();
}

function get(id) {

	return Rules()
		.where('id', parseInt(id))
		.first();
}

function add(ruleToAdd) {

	let ruleaux = {
		_ref: uuid(),
		active: true,
		description: ruleToAdd.description,
		rule: ruleToAdd.rule,
	};

	return Rules()
		.insert(ruleaux, 'id');
}

function update(ruleid, updates) {

	let ruleaux = {
		active: updates.active,
		description: updates.description,
		rule: updates.rule,
	};

	return Rules()
		.where('id', parseInt(ruleid))
		.update(ruleaux)
		.returning('*');
}

function del(ruleid, carId) {

	let ruleaux = {
		active: false,
	};

	return Rules()
		.where('id', parseInt(ruleid))
		.update(ruleaux);
}

module.exports = {getAll, get, add, update, del};

