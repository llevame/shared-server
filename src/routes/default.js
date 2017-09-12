// Default endpoint

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("info");

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', (req, res) => {
	res.send('Default endpoint on /api');
});

module.exports = router;
