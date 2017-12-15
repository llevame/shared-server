var knex = require('../knex.js');

function Stats() {
	return knex('statistics');
}

// queries wrappers

function getAll(start, end) {

	return Stats()
		.select('app_id', 'endpoint', 'method')
		.sum('count as total')
		.whereBetween('madeTime', [start, end])
		.groupBy('app_id', 'endpoint', 'method');
}

function add(stat) {

	return Stats()
		.insert(stat);
}

module.exports = {getAll, add};