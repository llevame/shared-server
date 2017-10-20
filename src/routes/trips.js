// trips endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// POST /
router.post('/', (req, res) => {
	res.status(200).json({
		type: 'GET',
		url: '/api/trips'
	});
});

// POST /estimate
router.post('/estimate', (req, res) => {
	res.status(200).json({
		type: 'GET',
		url: '/api/trips/estimate'
	});
});

// GET /{tripId}
router.post('/:tripId', (req, res) => {
	res.status(200).json({
		type: 'GET',
		url: '/api/trips/' + req.params.tripId
	});
});

module.exports = router;
