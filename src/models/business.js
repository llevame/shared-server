var error = require('../handlers/error-handler');
var businessUserQ = require('../../db/queries-wrapper/business_queries');
var builder = require('../builders/business_builder');
var log = require('log4js').getLogger("error");

function checkParametersBase(body) {

	return (body.username && body.password &&
		body.name && body.surname); 
}

function checkParameters(body) {

	return (checkParametersBase(body) &&
		body.roles && (body.roles.length > 0));
}

function checkParametersUpdate(body) {

	return (checkParameters(body) && body._ref);
}

function checkParametersUpdateMe(body) {

	return (checkParametersBase(body) && body._ref);
}

// returns all the available business users in the system
function getBusinessUsers(req, res) {

	businessUserQ.getAll()
		.then((users) => {
			let r = builder.createGetAllResponse(users);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// get a single business-user information
function getBusinessUser(req, res) {

	businessUserQ.get(req.params.userId)
		.then((bu) => {
			if (!bu) {
				return res.status(404).json(error.noResource());
			}
			
			let r = builder.createResponse(bu);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// post a new business users
function postBusinessUser(req, res) {

	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	businessUserQ.add(req.body)
		.then((userId) => {
			return businessUserQ.get(userId);
		})
		.then((bu) => {
			let r = builder.createResponse(bu);
			res.status(201).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// updates a business user
function updateBusinessUser(req, res) {
	
	if (!checkParametersUpdate(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	if (req.body.hasOwnProperty('id')) {
		return res.status(500).json(error.idFieldModification());
	}

	businessUserQ.get(req.params.userId)
		.then((user) => {
			if (!user) {
				return res.status(404).json(error.noResource());
			}

			if (user._ref !== req.body._ref) {
				return res.status(409).json(error.updateConflict());
			}

			businessUserQ.update(req.params.userId, req.body)
				.then((updatedUser) => {
					let r = builder.createResponse(updatedUser[0]);
					res.status(200).json(r);
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// deletes a business user
function deleteBusinessUser(req, res) {
	
	businessUserQ.get(req.params.userId)
		.then((user) => {
			if (!user) {
				return res.status(404).json(error.noResource());
			}

			businessUserQ.del(req.params.userId)
				.then(() => {
					res.sendStatus(204);
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((error) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

function getConnectedBusinessUser(req, res) {
	
	businessUserQ.get(req.user.id)
		.then((bu) => {
			if (!bu) {
				return res.status(404).json(error.noResource());
			}
			
			let r = builder.createResponse(bu);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

function updateConnectedBusinessUser(req, res) {

	if (!checkParametersUpdateMe(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	if (req.body.hasOwnProperty('id')) {
		return res.status(500).json(error.idFieldModification());
	}

	businessUserQ.get(req.user.id)
		.then((user) => {
			if (!user) {
				return res.status(404).json(error.noResource());
			}

			if (user._ref !== req.body._ref) {
				return res.status(409).json(error.updateConflict());
			}

			businessUserQ.update(req.user.id, req.body)
				.then((updatedUser) => {
					let r = builder.createResponse(updatedUser[0]);
					res.status(200).json(r);
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getBusinessUsers, getBusinessUser,
	postBusinessUser, updateBusinessUser,
	deleteBusinessUser, getConnectedBusinessUser,
	updateConnectedBusinessUser};
