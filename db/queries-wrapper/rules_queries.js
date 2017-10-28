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

function add(rule) {

	let ruleaux = {
		_ref: uuid(),
		blob: rule.blob,
		author: rule.author,
		message: 'New rule',
		timestamp: rule.timestamp,
		active: rule.active
	};

	return Rules()
		.insert(ruleaux, 'id');
}

function update(id, updates) {

	let ruleaux = {
		_ref: uuid(),
		blob: updates.blob,
		author: updates.author,
		message: 'Update rule',
		timestamp: updates.timestamp,
		active: updates.active
	};

	return Rules()
		.where('id', parseInt(id))
		.update(ruleaux)
		.returning('*');
}

function del(id) {

	let ruleaux = {
		active: false,
	};

	return Rules()
		.where('id', parseInt(id))
		.update(ruleaux);
}

module.exports = {getAll, get, add, update, del};

