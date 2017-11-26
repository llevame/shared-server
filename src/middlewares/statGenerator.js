// middleware that generates an entry in the stats database table
// with the app_server_id, endpoint and method

var urlParser = require('url');
var error = require('../handlers/error-handler');
var statsQ = require('../../db/queries-wrapper/stats_queries');

function generateStat(req, res, next) {

	let stat = {
		app_id: req.user.id,
		endpoint: urlParser.parse(req.originalUrl).pathname,
		method: req.method
	};

	statsQ.add(stat)
		.then(() => {
			next();
		})
		.catch((error) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			return res.status(500).json(error.unexpected(err));
		});
}

module.exports = {generateStat};