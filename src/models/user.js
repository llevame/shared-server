let error = require('../handlers/error-handler');
let userQ = require('../../db/queries-wrapper/users_queries');
var log = require('log4js').getLogger("error");
var v = require('../../package.json').version;

function checkParametersValidate(body) {

	return (body.username && body.password &&
		body.facebookAuthToken);
}

function checkParameters(body) {

	return (body.type && body.username && body.password &&
		body.fb && body.firstName && body.lastName &&
		body.country && body.email && body.birthdate &&
		body.images);
}

function checkParametersUpdate(body) {

	return (checkParameters(body) && body._ref);
}

function credentialsAreValid(user, credentials) {

	return ((user.username == credentials.username) &&
		(user.password == credentials.password) &&
		(user.fb.authToken == credentials.facebookAuthToken));
}

// returns all the available users
function getUsers(req, res) {

	userQ.getAll()
		.then((app_users) => {
			
			let usrs = {
				
				metadata: {
					count: app_users.length,
					total: app_users.length,
					version: v
				},
				users: app_users
			};

			res.status(200).json(usrs);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// returns information about a specific user
function getUser(req, res) {

	userQ.get(req.params.userId)
		.then((u) => {
			if (!u) {
				return res.status(404).json(error.noResource());
			}

			let usr = {
				metadata: {
					version: v
				},
				user: u
			};

			res.status(200).json(usr);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// post a new user into the system
function postUser(req, res) {

	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	userQ.add(req.body)
		.then((userId) => {
			return userQ.get(userId);
		})
		.then((u) => {
			
			let usr = {
				metadata: {
					version: v
				},
				user: u
			};

			res.status(201).json(usr);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// delete a user
function deleteUser(req, res) {

	userQ.get(req.params.userId)
		.then((u) => {
			if (!u) {
				return res.status(404).json(error.noResource());
			}

			userQ.del(req.params.userId)
				.then(() => {
					res.sendStatus(204);
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

// updates information of a user
function updateUser(req, res) {

	if (!checkParametersUpdate(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	if (req.body.hasOwnProperty('id')) {
		return res.status(500).json(error.idFieldModification());
	}

	userQ.get(req.params.userId)
		.then((u) => {
			if (!u) {
				return res.status(404).json(error.noResource());
			}

			if (u._ref !== req.body._ref) {
				return res.status(409).json(error.updateConflict());
			}

			userQ.update(req.params.userId, req.body)
				.then((updatedUser) => {
					
					let update = {
						metadata: {
							version: v
						},
						user: updatedUser
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

// validate a user
function validateUser(req, res) {

	if (!checkParametersValidate(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	userQ.getByUsername(req.body.username)
		.then((u) => {
			if (!u) {
				return res.status(404).json(error.noResource());
			}

			if (!credentialsAreValid(u, req.body)) {
				return res.status(400).json(error.faillingValidation());
			}

			userQ.get(u.id)
				.then((usr) => {
				
					let r = {
			
						metadata: {
							version: v
						},
						user: usr
					};

					res.status(200).json(r);
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

module.exports = {getUsers, getUser, postUser, validateUser, deleteUser, updateUser};
