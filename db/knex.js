var environment = process.env.NODE_ENV;

if (!process.env.NODE_ENV) {
	environment = environment || 'development';
}

var config = require('../knexfile.js')[environment];

var knex = require('knex')(config);

module.exports = knex;

if (process.env.NODE_ENV !== 'test') {
	knex.migrate.latest(config);
}

