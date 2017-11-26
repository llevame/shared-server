var error = require('../handlers/error-handler');
var statsQ = require('../../db/queries-wrapper/stats_queries');
var builder = require('../builders/stats_builder');
var log = require('log4js').getLogger("error");

// get statistics about the count of
// request per app-server they are getting in
// each endpoint
function getStats(req, res) {

	let startTime = req.query.startTime;
	let endTime = req.query.endTime;

	if (!startTime || !endTime) {
		return res.status(400).json(error.missingParameters());
	}

	statsQ.getAll(startTime, endTime)
		.then((stats) => {
			let r = builder.createResponse(stats);
			res.status(200).json(r);
		})
		.catch((error) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getStats};