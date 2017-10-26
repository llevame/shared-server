// business-users endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var business = require('../models/business');
var tokenVerifier = require('../middlewares/businessTokenVerifier');
var roleVerifier = require('../middlewares/roleVerifier');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /me
router.get('/me', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), business.getConnectedBusinessUser);

// PUT /me
router.put('/me', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), business.updateConnectedBusinessUser);

// GET /
router.get('/', tokenVerifier.verifyToken, roleVerifier(['admin']), business.getBusinessUsers);

// POST /
router.post('/', tokenVerifier.verifyToken, roleVerifier(['admin']), business.postBusinessUser);

// GET /:userId
router.get('/:userId', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), business.getBusinessUser);

// PUT /:userId
router.put('/:userId', tokenVerifier.verifyToken, roleVerifier(['admin']), business.updateBusinessUser);

// DELETE /:userId
router.delete('/:userId', tokenVerifier.verifyToken, roleVerifier(['admin']), business.deleteBusinessUser);

module.exports = router;
