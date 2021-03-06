var error = require('../handlers/error-handler');
var businessUserQ = require('../../db/queries-wrapper/business_queries');
var builder = require('../builders/business_builder');
var log = require('log4js').getLogger('error');

function checkParametersBase(body) {
	return body.username && body.password && body.name && body.surname;
}

function checkParameters(body) {
	return checkParametersBase(body) && body.roles && body.roles.length > 0;
}

function checkParametersUpdate(body) {
	return checkParameters(body) && body._ref;
}

function checkParametersUpdateMe(body) {
	return checkParametersBase(body) && body._ref;
}

function getInformation(req, res, id) {
	businessUserQ
		.get(id)
		.then(bu => {
			if (!bu) {
				return res.status(404).json(error.noResource());
			}

			let r = builder.createResponse(bu);
			res.status(200).json(r);
		})
		.catch(err => {
			/* istanbul ignore next */
			log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
			/* istanbul ignore next */
			res.status(500).json(error.unexpected(err));
		});
}

function updateInformation(req, res, id) {

	businessUserQ
		.get(id)
		.then(user => {
			if (!user) {
				return res.status(404).json(error.noResource());
			}

			if (user._ref !== req.body._ref) {
				return res.status(409).json(error.updateConflict());
			}

			businessUserQ
				.update(id, req.body)
				.then(updatedUser => {
					let r = builder.createResponse(updatedUser[0]);
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

// returns all the available business users in the system
function getBusinessUsers(req, res) {
	businessUserQ
		.getAll()
		.then(users => {
			let r = builder.createGetAllResponse(users);
			res.status(200).json(r);
		})
		.catch(err => {
			/* istanbul ignore next */
			log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
			/* istanbul ignore next */
			res.status(500).json(error.unexpected(err));
		});
}

// get a single business-user information
function getBusinessUser(req, res) {
	getInformation(req, res, req.params.userId);
}

// post a new business users
function postBusinessUser(req, res) {
	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	businessUserQ
		.add(req.body)
		.then(userId => {
			return businessUserQ.get(userId);
		})
		.then(bu => {
			let r = builder.createResponse(bu);
			res.status(201).json(r);
		})
		.catch(err => {
			/* istanbul ignore next */
			log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
			/* istanbul ignore next */
			res.status(500).json(error.unexpected(err));
		});
}

// updates a business user
function updateBusinessUser(req, res) {
	if (!checkParametersUpdate(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	updateInformation(req, res, req.params.userId);
}

// deletes a business user
function deleteBusinessUser(req, res) {
	businessUserQ
		.get(req.params.userId)
		.then(user => {
			if (!user) {
				return res.status(404).json(error.noResource());
			}

			businessUserQ
				.del(req.params.userId)
				.then(() => {
					res.sendStatus(204);
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

// gets information about the connected business-user.
// the user is logged in via the /token endpoint
function getConnectedBusinessUser(req, res) {
	getInformation(req, res, req.user.id);
}

// updates information about the connected business-user.
// the user is logged in via the /token endpoint
function updateConnectedBusinessUser(req, res) {

	if (!checkParametersUpdateMe(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	updateInformation(req, res, req.user.id);
}

module.exports = {
	getBusinessUsers,
	getBusinessUser,
	postBusinessUser,
	updateBusinessUser,
	deleteBusinessUser,
	getConnectedBusinessUser,
	updateConnectedBusinessUser,
};
