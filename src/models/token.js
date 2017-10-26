var service = require('../libs/service');
var error = require('../handlers/error-handler');
var v = require('../../package.json').version;
var businessQ = require('../../db/queries-wrapper/business_queries');
var log = require('log4js').getLogger("error");

function isThereAnAdminUser(users) {
	
	if (users.length == 0) {
		return false;
	}

	for (u in users) {
		
		if (users[u].roles.some((role) => {
			return (role == "admin");
		})) {
			return true;
		}
	}

	return false;
}

// returns a new token for a busines-user (login)
function getToken(req, res) {

	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		return res.status(400).json(error.missingParameters());
	}

	if ((username == "root") && (password == "root")) {

		businessQ.getAll()
			.then((users) => {

				if ((users.length == 0) || !isThereAnAdminUser(users)) {

					let tok = {
						metadata: {
							version: v
						},
						token: {
							expiresAt: service.expiration,
							token: service.createBusinessToken({id: 0, roles: ["admin"]})
						}
					};

					res.status(201).json(tok);
				} else {
					return res.status(401).json(error.unathoAccess());
				}
			})
			.catch((err) => {
				log.error("Error: " + err.message + " on: " + req.originalUrl);
				res.status(500).json(error.unexpected(err));
			});

	} else {

		businessQ.getByUsername(username)
			.then((bu) => {
				
				if (!bu) {
					return res.status(401).json(error.unathoAccess());
				}
				
				if (bu.password != password) {
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
				log.error("Error: " + err.message + " on: " + req.originalUrl);
				res.status(500).json(error.unexpected(err));
			});
	}
}

module.exports = {getToken};
