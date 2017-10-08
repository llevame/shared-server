var environment = process.env.NODE_ENV;

if (!process.env.NODE_ENV) {
	environment = environment || 'development';
}

var config = require('../knexfile.js')[environment];

module.exports = require('knex')(config);
