var environment = process.env.NODE_ENV;
var log = require('log4js').getLogger("consola");

if (!process.env.NODE_ENV) {
	environment = environment || 'development';
}

var config = require('../knexfile.js')[environment];

var knex = require('knex')(config);

module.exports = knex;

if (process.env.NODE_ENV != 'test') {
	log.info("Start migration");
	knex.migrate.latest([config]);
	log.info("End migration");
}

