// statistics endpoint

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var tokenVerifier = require('../middlewares/businessTokenVerifier');
var stats = require('../models/statistics');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', tokenVerifier.verifyToken, stats.getStats);

module.exports = router;