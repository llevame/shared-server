// servers endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("info");

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// POST /ping
router.post('/ping', (req, res) => {
	res.send('POST request on /servers/ping');
});

module.exports = router;
