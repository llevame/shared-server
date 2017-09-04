// servers endpoints

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

// POST /ping
router.post('/ping', (req, res) => {
	res.send('POST request on /servers/ping');
});

module.exports = router;
