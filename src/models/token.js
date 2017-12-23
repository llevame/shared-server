var error = require('../handlers/error-handler');
var v = require('../../package.json').version;
var businessQ = require('../../db/queries-wrapper/business_queries');
var tokenBuilder = require('../builders/token_builder');
var log = require('log4js').getLogger('error');

function isThereAnAdminUser(users) {
	/* istanbul ignore next */
	if (users.length == 0) {
		return false;
	}

	for (u in users) {
		/* istanbul ignore next */
		if (
			users[u].roles.some(role => {
				return role == 'admin';
			})
		) {
			return true;
		}
	}
	/* istanbul ignore next */
	return false;
}

// returns a new token for a busines-user (login)
function getToken(req, res) {
	let username = req.body.username;
	let password = req.body.password;

	if (!username || !password) {
		return res.status(400).json(error.missingParameters());
	}

	if (username == 'root' && password == 'root') {
		businessQ
			.getAll()
			.then(users => {
				if (users.length == 0 || !isThereAnAdminUser(users)) {
					res.status(201).json(
						tokenBuilder.createTokenResponse({
							id: 0,
							roles: ['admin'],
						})
					);
				} else {
					return res.status(401).json(error.unathoAccess());
				}
			})
			.catch(err => {
				/* istanbul ignore next */
				log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
				/* istanbul ignore next */
				res.status(500).json(error.unexpected(err));
			});
	} else {
		businessQ
			.getByUsername(username)
			.then(bu => {
				if (!bu) {
					return res.status(401).json(error.unathoAccess());
				}

				if (bu.password != password) {
					return res.status(401).json(error.unathoAccess());
				}

				res.status(201).json(tokenBuilder.createTokenResponse(bu));
			})
			.catch(err => {
				/* istanbul ignore next */
				log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
				/* istanbul ignore next */
				res.status(500).json(error.unexpected(err));
			});
	}
}

module.exports = { getToken };
