var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");
var geo = require('geolib');
var moment = require('moment');
var rulesQ = require('../../db/queries-wrapper/rules_queries');
var transactionQ = require('../../db/queries-wrapper/transaction_queries');
var tripsQ = require('../../db/queries-wrapper/trips_queries');
var builder = require('../builders/trips_builder');
var rulesModel = require('./rules');
var paymethods = require('./paymethods');

function checkParameters(body) {
	
	return (body.trip && body.paymethod);
}

function checkEstimateParameters(body) {

	return (body && body.passenger &&
			body.start && body.end &&
			body.start.timestamp && 
			body.start.address &&
			body.start.address.street &&
			body.start.address.location &&
			body.end.address &&
			body.end.address.street &&
			body.end.address.location);
}

function postTrip(req, res) {

	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	var fact = {
		"driver": req.body.trip.driver,
		"passenger": req.body.trip.passenger,
		"distance": req.body.trip.distance,
		"isFirstTrip": false,
		"hasLlevameDomain": false,
		"tripsInTheDayPassenger": 12,
		"tripsInTheLastHalfHourPassenger": 11,
		"tripsInTheDayDriver": 12,
		"startDay": moment(req.body.trip.start.timestamp*1000).format('dddd'),
		"startTime": parseInt(moment(req.body.trip.start.timestamp*1000).format('H')),
		"endDay": moment(req.body.trip.end.timestamp*1000).format('dddd'),
		"endTime": parseInt(moment(req.body.trip.end.timestamp*1000).format('H')),
		"cp": [],
		"pp": []
	};

	// run all active rules with trip information
	// as the fact
	rulesQ.getAllActive()
		.then((rules) => {
			rulesModel.runTripRules(req, res, rules, fact)
				.then((result) => {

					let currency = 'ARS'; // currency ISO 4217 standar
					let sumPassenger = result.cp.reduce((total, num) => {
						return total + num;
					});
					let sumDriver = result.pp.reduce((total, num) => {
						return total + num;
					});

					let cost = result.cost + sumPassenger;
					let pay = result.pay + sumDriver;

					tripsQ.add(req.body, cost, currency)
						.then((tripId) => {

							let r = [];
							r.push(transactionQ.addTransactionTrip(req.body.trip.passenger,
																	tripId,
																	cost * (-1),
																	req.body.trip)); //Negative -> passenger
							r.push(transactionQ.addTransactionTrip(req.body.trip.driver,
																	tripId,
																	pay,
																	req.body.trip)); //Positive -> driver
							Promise.all(r)
								.then((results) => {
									var data = {
										currency: currency,
										value: cost,
										paymethod: req.body.paymethod
									};
									paymethods.generatePayment(data);
									transactionQ.addTransactionTrip(req.body.trip.passenger, tripId, cost, req.body.trip)
										.then((transId) => {
											res.status(200).json(builder.createResponse(req.body.trip, currency, cost));
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

function estimateTrip(req, res) {

	if (!checkEstimateParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	let startLocation = [req.body.start.address.location.lon, req.body.start.address.location.lat];
	let endLocation = [req.body.end.address.location.lon, req.body.end.address.location.lat];

	let distance = geo.getDistance(startLocation, endLocation);

	var fact = {
		"passenger": req.body.passenger,
		"start": req.body.start,
		"end": req.body.end,
		"distance": distance
	};

	// run all active rules with trip information
	// as the fact
	rulesQ.getAllActive()
		.then((rules) => {
			rulesModel.runTripRules(req, res, rules, fact)
				.then((result) => {

					let currency = 'ARS'; // currency ISO 4217 standar 
					let cost = result.cost;

					res.status(200).json(builder.createEstimateResponse(currency, cost));
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

function getTrip(req, res) {

	tripsQ.get(req.params.tripId)
		.then((t) => {
			if (!t) {
				return res.status(404).json(error.noResource());
			}
			let r = builder.createResponse(t, t.cost.currency, t.cost.value);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {postTrip, estimateTrip, getTrip};
