// Default endpoint

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
	res.send('Default endpoint on /api');
});

module.exports = router;
