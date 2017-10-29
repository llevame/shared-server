// paymethods endpoint

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var paymethods = require('../models/paymethods');
var tokenVerifier = require('../middlewares/appTokenVerifier');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', tokenVerifier.verifyToken, paymethods.getPaymethods);
//router.get('/', paymethods.getPaymethods);

module.exports = router;
