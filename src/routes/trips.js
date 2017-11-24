// trips endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var trip = require('../models/trips');
var tokenVerifier = require('../middlewares/appTokenVerifier');
var tokenBusinessVerifier = require('../middlewares/businessTokenVerifier');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// POST /
router.post('/', tokenVerifier.verifyToken, trip.postTrip);

// POST /estimate
router.post('/estimate', tokenVerifier.verifyToken, trip.estimateTrip);

// GET /{tripId}
router.get('/:tripId', tokenVerifier.verifyToken, trip.getTrip);

// GET /
router.get('/', tokenBusinessVerifier.verifyToken, trip.getTrips);

module.exports = router;
