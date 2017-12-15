// Token endpoint

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger('http');
let token = require('../models/token');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// POST /
router.post('/', token.getToken);

module.exports = router;
