// paymethods endpoint

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

// GET /
router.get('/', (req, res) => {
	res.send('GET request on /paymethods');
});

module.exports = router;
