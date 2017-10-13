let authorization = require('../handlers/auth-handler');
let error = require('../handlers/error-handler');
let businessUserQ = require('../../db/queries-wrapper/business_queries');
var log = require('log4js').getLogger("error");
var v = require('../../package.json').version;

function checkParameters(body) {
	return (body.username && body.password &&
		body.name && body.surname &&
		body.roles);
}

// returns all the available business users in the system
function getBusinessUsers(req, res) {
	businessUserQ.getAll()
		.then((users) => {
			
			let busers = {
				metadata: {
					count: users.length,
					total: users.length,
					version: v
				},
				businessUser: users
			};
			res.status(200).json(busers);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// get a single business-user information
function getBusinessUser(req, res) {

	if (!authorization.authorizeUser(req.body)) {
		return res.status(401).json(error.unathoAccess());
	}

	businessUserQ.get(req.params.userId)
		.then((bu) => {
			if (!bu) {
				return res.status(404).json(error.noResource());
			}

			let buser = {
				metadata: {
					version: v
				},
				businessUser: bu
			};

			res.status(200).json(buser);

		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
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

			let buser = {
				metadata: {
					version: v
				},
				businessUser: bu
			};

			res.status(201).json(buser);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// updates a business user
function updateBusinessUser(req, res) {
	
	if (!checkParameters(req.body)) {
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

					let update = {
						metadata: {
							version: v
						},
						businessUser: updatedUser
					};

					res.status(200).json(update);
				})
				.catch((err) => {
					log.error("Error: " + err.message + "on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// deletes a business user
function deleteBusinessUser(req, res) {
	
	if (!authorization.authorizeUser(req.body)) {
		return res.status(401).json(error.unathoAccess());
	}

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
					log.error("Error: " + err.message + "on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((error) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getBusinessUsers, getBusinessUser, postBusinessUser, updateBusinessUser, deleteBusinessUser};
