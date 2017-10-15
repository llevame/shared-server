var service = require('../libs/service');
let error = require('../handlers/error-handler');
let log = require('log4js').getLogger("error");
let v = require('../../package.json').version;
let businessQ = require('../../db/queries-wrapper/business_queries');

// returns a new token for a busines-user (login)
function getToken(req, res) {

	if (!req.body.username || !req.body.password) {
		return res.status(400).json(error.missingParameters());
	}

	businessQ.getByUsername(req.body.username)
		.then((bu) => {
			
			if (!bu) {
				return res.status(401).json(error.unathoAccess());
			}
			
			if (bu.password != req.body.password) {
				return res.status(401).json(error.unathoAccess());
			}

			let tok = {
				metadata: {
					version: v
				},
				token: {
					expiresAt: service.expiration,
					token: service.createBusinessToken(bu)
				}
			};

			res.status(201).json(tok);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getToken};
