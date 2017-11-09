var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");
var rulesQ = require('../../db/queries-wrapper/rules_queries');
var transactionQ = require('../../db/queries-wrapper/transaction_queries');
var tripsQ = require('../../db/queries-wrapper/trips_queries');
var builder = require('../builders/trips_builder');
var rulesModel = require('./rules');
var paymethods = require('./paymethods');

function checkParameters(body) {
	
	return (body.trip && body.paymethod);
}

function postTrip(req, res) {

	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	var fact = {
		"driver": req.body.trip.driver,
		"passenger": req.body.trip.passenger,
		"start": req.body.trip.start,
		"end": req.body.trip.end,
		"totaltime": req.body.trip.totaltime,
		"waitTime": req.body.trip.waitTime,
		"travelTime": req.body.trip.travelTime,
		"distance": req.body.trip.distance
	};

	// run all active rules with trip information
	// as the fact
	rulesQ.getAllActive()
		.then((rules) => {
			rulesModel.runTripRules(req, res, rules, fact)
				.then((result) => {

					let currency = 'ARS'; // currency ISO 4217 standar 
					let cost = result.cost;
					let pay = result.pay;

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

	res.status(200).json({
		type: 'GET',
		url: '/api/trips/estimate'
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
