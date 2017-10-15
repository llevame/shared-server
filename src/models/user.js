var error = require('../handlers/error-handler');
var userQ = require('../../db/queries-wrapper/users_queries');
var carQ = require('../../db/queries-wrapper/cars_queries');
var builder = require('../builders/users_builder');
var log = require('log4js').getLogger("error");

function mergeCarsWithUsers(users, cars) {

	let r = [];

	for (u in users) {
		users[u].cars = [];
		for (c in cars) {
			if (cars[c].owner == ((users[u].id).toString())) {
				users[u].cars.push(cars[c]);
			}
		}
		r.push(users[u]);
	}

	return r;
}

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
			carQ.getAll()
				.then((userCars) => {
					let r = mergeCarsWithUsers(app_users, userCars);
					let usrs = builder.createGetAllResponse(r);
					res.status(200).json(usrs);
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

// returns information about a specific user
function getUser(req, res) {

	userQ.get(req.params.userId)
		.then((u) => {
			if (!u) {
				return res.status(404).json(error.noResource());
			}

			carQ.getAllOfUser(req.params.userId)
				.then((userCars) => {
					let usr = builder.createResponse(u, userCars);
					res.status(200).json(usr);
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
			let usr = builder.createResponse(u, []);
			res.status(201).json(usr);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
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

			carQ.delAllOfUser(req.params.userId)
				.then(() => {
					userQ.del(req.params.userId)
						.then(() => {
							res.sendStatus(204);
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
			})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
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
					carQ.getAllOfUser(req.params.userId)
						.then((userCars) => {
							let usr = builder.createResponse(updatedUser, userCars);
							res.status(200).json(usr);
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
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
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
					carQ.getAllOfUser(req.params.userId)
						.then((userCars) => {
							let r = builder.createResponse(usr, userCars);
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

		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getUsers, getUser, postUser, validateUser, deleteUser, updateUser};
