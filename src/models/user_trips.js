var error = require('../handlers/error-handler');
var tripsQ = require('../../db/queries-wrapper/trips_queries');
var usersQ = require('../../db/queries-wrapper/users_queries');
var builder = require('../builders/trips_builder');
var log = require('log4js').getLogger('error');

// returns all the trips made by a specific user
function getTrips(req, res) {
	usersQ
		.get(req.params.userId)
		.then(user => {
			if (!user) {
				return res.status(404).json(error.noResource());
			}

			tripsQ
				.getAllByUser(req.params.userId, user.type)
				.then(userTrips => {
					let r = builder.createGetAllResponse(userTrips);
					res.status(200).json(r);
				})
				.catch(err => {
					/* istanbul ignore next */
					log.error(
						'Error: ' + err.message + ' on: ' + req.originalUrl
					);
					/* istanbul ignore next */
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch(err => {
			/* istanbul ignore next */
			log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
			/* istanbul ignore next */
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = { getTrips };
