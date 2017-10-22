var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");

function postTrip(req, res) {

	res.status(200).json({
		type: 'GET',
		url: '/api/trips'
	});
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