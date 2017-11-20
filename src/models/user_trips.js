var error = require('../handlers/error-handler');
var tripsQ = require('../../db/queries-wrapper/trips_queries');
var v = require('../../package.json').version;
var log = require('log4js').getLogger("error");

// returns all the trips made by a specific user
function getTrips(req, res) {

	tripsQ.getAllByUser(req.params.userId, 'passenger')
		.then((userTrips) => {
			let trps = {
				metadata: {
					count: userTrips.length,
					total: userTrips.length,
					version: v
				},
				trips: userTrips
			};
			res.status(200).json(trps);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getTrips};
