var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");
var rulesQ = require('../../db/queries-wrapper/rules_queries');
var transactionQ = require('../../db/queries-wrapper/transaction_queries');
var tripsQ = require('../../db/queries-wrapper/trips_queries');
var builder = require('../builders/rules_builder');
var tripsbuilder = require('../builders/trips_builder');
var paymethodsmodel = require('../models/paymethods');

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
	    "start":req.body.trip.start,
	    "end":req.body.trip.end,
	    "totaltime":req.body.trip.totaltime,
	    "waitTime":req.body.trip.waitTime,
	    "travelTime":req.body.trip.travelTime,
	    "distance":req.body.trip.distance,
	    "route":req.body.trip.route,
	    "paymethod":req.body.paymethod,
	};

	//run rules active
	var activeRules= rulesQ.getAllActive();
	var rules = activeRules.map((rule) => rule.blob);
	try{
	
		var rules = new Array(rule.blob);
		var fact= builder.createFact(fact);
		var results = runTripRules(rules, serializedFact);
		var tripCost = 0; //TODO get from results.
		var currency = req.body.currency;
		var tripId= tripsQ.add(req.trip);
		var passengerTransaction = transactionQ.addTransactionTrip(req.body.trip.passenger,tripId,tripCost *(-1),trip); //Negative -> passenger
		var driverTransaction = transactionQ.addTransactionTrip(req.body.trip.driver,tripId,tripCost,trip); //Positive -> driver
		var data = {
			transaction_id: passengerTransaction,
			currency: currency,
			paymethod:req.paymethod,
			value: tripCost,
		};	
		var result= paymethodsmodel.generatePayment(data);
	
		if (typeof result != 'string'){
			transactionQ.addTransactionTrip(req.trip.passenger,tripId,tripCost,trip);
			res.status(200).json(tripsbuilder.createResponse(req.trip,currency,tripCost));
		}else{
			res.status(500).json(error.unexpected(result));	
		}
				
		
	}catch(err) {
		log.error("Error: " + err.message + " on: " + req.originalUrl);
		res.status(500).json(error.unexpected(err));	
	}
}

function estimateTrip(req, res) {

	res.status(200).json({
		type: 'GET',
		url: '/api/trips/estimate'
	});
}

function getTrip(req, res) {

	res.status(200).json({
		type: 'GET',
		url: '/api/trips/' + req.params.tripId
	});
}

module.exports = {postTrip, estimateTrip, getTrip};
