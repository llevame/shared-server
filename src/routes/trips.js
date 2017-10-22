// trips endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var trip = require('../models/trips');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// POST /
router.post('/', trip.postTrip);

// POST /estimate
router.post('/estimate', trip.estimateTrip);

// GET /{tripId}
router.post('/:tripId', trip.getTrip);

module.exports = router;
