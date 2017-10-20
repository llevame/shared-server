var error = require('../handlers/error-handler');
var carQ = require('../../db/queries-wrapper/cars_queries');
var builder = require('../builders/cars_builder');
var log = require('log4js').getLogger("error");

function checkParameters(body) {
	return (body.properties && (body.properties.length > 0));
}

function checkParametersUpdate(body) {
	
	return (checkParameters(body) &&
		body.owner && body._ref);
}

// returns all the cars of a specific user
function getCars(req, res) {

	carQ.getAllOfUser(req.params.userId)
		.then((cars) => {
			let r = builder.createGetAllResponse(cars);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// returns information about a specif car of a user
function getCar(req, res) {

	carQ.get(req.params.userId, req.params.carId)
		.then((c) => {
			
			if (!c) {
				return res.status(404).json(error.noCar());
			}

			let r = builder.createResponse(c);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// post a new car of a specific user
function postCar(req, res) {

	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	carQ.add(req.params.userId, req.body)
		.then((carId) => {
			return carQ.get(req.params.userId, carId);
		})
		.then((c) => {
			let r = builder.createResponse(c);
			res.status(201).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// updates the information of a specific car of a user
function updateCar(req, res) {

	if (!checkParametersUpdate(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	carQ.get(req.params.userId, req.params.carId)
		.then((c) => {
			if (!c) {
				return res.status(404).json(error.noCar());
			}

			if (c._ref !== req.body._ref) {
				return res.status(409).json(error.updateConflict());
			}

			carQ.update(req.params.userId, req.params.carId, req.body)
				.then((updatedCar) => {
					let r = builder.createResponse(updatedCar);
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

// delete a car of a specific user
function deleteCar(req, res) {

	carQ.get(req.params.userId, req.params.carId)
		.then((c) => {
			
			if (!c) {
				return res.status(404).json(error.noCar());
			}
				
			carQ.del(req.params.userId, req.params.carId)
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

module.exports = {getCars, postCar, getCar, updateCar, deleteCar};

