// trips endpoints

var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use((req, res, next) => {
	console.log('Request type: ', req.method);
	next();
}, (req, res, next) => {
	console.log('Request URL: ', req.originalUrl);
	next();
});

// POST /
router.post('/', (req, res) => {
	res.send('POST request on /trips');
});

// POST /estimate
router.post('/estimate', (req, res) => {
	res.send('POST request on /trips/estimate');
});

// GET /{tripId}
router.post('/:tripId', (req, res) => {
	res.send('GET request on /trips/' + req.params.tripId);
});

module.exports = router;
