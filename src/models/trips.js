var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");
var geo = require('geolib');
var moment = require('moment');
var rulesQ = require('../../db/queries-wrapper/rules_queries');
var transactionQ = require('../../db/queries-wrapper/transaction_queries');
var tripsQ = require('../../db/queries-wrapper/trips_queries');
var usersQ = require('../../db/queries-wrapper/users_queries');
var builder = require('../builders/trips_builder');
var rulesModel = require('./rules');
var paymethods = require('./paymethods');

function checkParameters(body) {
	
	return (body.trip && body.paymethod &&
			body.trip.driver && body.trip.passenger &&
			body.trip.start && body.trip.end &&
			body.trip.start.timestamp &&
			body.trip.start.address &&
			body.trip.start.address.street &&
			body.trip.start.address.location &&
			body.trip.end.timestamp &&
			body.trip.end.address &&
			body.trip.end.address.street &&
			body.trip.end.address.location &&
			(body.trip.distance > 0));
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

function tripsInAPeriodOfTime(trips, start, end) {

	return trips.map((trip) => {
		return trip.start.timestamp;
	}).filter((ts) => {
		return (ts >= start) && (ts <= end);
	});
}

function calculateTotal(subTotal, parcials) {

	return subTotal + (parcials.length > 0) ? 
		parcials.reduce((total, num) => {
			return total + num;
		}) : 0;
}

function postTrip(req, res) {

	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	let q = [];
	q.push(tripsQ.getAllByUser(req.body.trip.passenger, 'passenger'));
	q.push(tripsQ.getAllByUser(req.body.trip.driver, 'driver'));
	q.push(usersQ.get(req.body.trip.passenger));

	Promise.all(q)
		.then((data) => {

			let startOfTheDay = moment(req.body.trip.start.timestamp*1000).startOf('day').unix();
			let endOfTheDay = moment(req.body.trip.start.timestamp*1000).endOf('day').unix();
			let endT = req.body.trip.start.timestamp;
			let startT = moment(endT*1000).subtract(30, 'minutes').unix();

			let passengerTripsInDay = tripsInAPeriodOfTime(data[0], startOfTheDay, endOfTheDay);
			let driverTripsInDay = tripsInAPeriodOfTime(data[1], startOfTheDay, endOfTheDay);
			let passengerTripsInTheLastHalfHour = tripsInAPeriodOfTime(data[0], startT, endT);

			var fact = {
				"driver": req.body.trip.driver,
				"passenger": req.body.trip.passenger,
				"distance": req.body.trip.distance,
				"isFirstTrip": (data[0].length > 0) ? false : true,
				"hasLlevameDomain": (data[2].email.includes("@llevame.com")) ? true : false,
				"tripsInTheDayPassenger": passengerTripsInDay.length,
				"tripsInTheLastHalfHourPassenger": passengerTripsInTheLastHalfHour.length,
				"tripsInTheDayDriver": driverTripsInDay.length,
				"startDay": moment(req.body.trip.start.timestamp*1000).format('dddd'),
				"startTime": parseInt(moment(req.body.trip.start.timestamp*1000).format('H')),
				"endDay": moment(req.body.trip.end.timestamp*1000).format('dddd'),
				"endTime": parseInt(moment(req.body.trip.end.timestamp*1000).format('H')),
				"cp": [],
				"pp": []
			};
			console.log(fact);
			// run all active rules with trip information
			// as the fact
			rulesQ.getAllActive()
				.then((rules) => {
					rulesModel.runTripRules(req, res, rules, fact)
						.then((result) => {

							let currency = 'ARS'; // currency ISO 4217 standar

							let cost = calculateTotal(result.cost, result.cp);
							let pay = calculateTotal(result.pay, result.pp);
							console.log("cost: ", cost, " pay: ", pay);

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
										.then((transactionsIds) => {
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

	var distance = geo.getDistance(startLocation, endLocation);

	let q = [];
	q.push(tripsQ.getAllByUser(req.body.passenger, 'passenger'));
	q.push(usersQ.get(req.body.passenger));

	Promise.all(q)
		.then((data) => {

			let startOfTheDay = moment(req.body.start.timestamp*1000).startOf('day').unix();
			let endOfTheDay = moment(req.body.start.timestamp*1000).endOf('day').unix();
			let endT = req.body.start.timestamp;
			let startT = moment(endT*1000).subtract(30, 'minutes').unix();

			let passengerTripsInDay = tripsInAPeriodOfTime(data[0], startOfTheDay, endOfTheDay);
			let passengerTripsInTheLastHalfHour = tripsInAPeriodOfTime(data[0], startT, endT);

			var fact = {
				"driver": 0,
				"passenger": req.body.passenger,
				"distance": distance,
				"isFirstTrip": (data[0].length > 0) ? false : true,
				"hasLlevameDomain": (data[1].email.includes("@llevame.com")) ? true : false,
				"tripsInTheDayPassenger": passengerTripsInDay.length,
				"tripsInTheLastHalfHourPassenger": passengerTripsInTheLastHalfHour.length,
				"tripsInTheDayDriver": 0,
				"startDay": moment(req.body.start.timestamp*1000).format('dddd'),
				"startTime": parseInt(moment(req.body.start.timestamp*1000).format('H')),
				"endDay": null,
				"endTime": null,
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
							let cost = calculateTotal(result.cost, result.cp);

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
