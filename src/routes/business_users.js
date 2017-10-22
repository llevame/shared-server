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

router.get('/me', tokenVerifier.verifyTokenMe, roleVerifier(['admin', 'manager', 'user']), business.getConnectedBusinessUser);

router.put('/me', tokenVerifier.verifyTokenMe, roleVerifier(['admin', 'manager', 'user']), business.updateConnectedBusinessUser);

router.get('/', tokenVerifier.verifyToken, roleVerifier(['admin']), business.getBusinessUsers);

router.post('/', tokenVerifier.verifyToken, roleVerifier(['admin']), business.postBusinessUser);

router.get('/:userId', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), business.getBusinessUser);

router.put('/:userId', tokenVerifier.verifyToken, roleVerifier(['admin']), business.updateBusinessUser);

router.delete('/:userId', tokenVerifier.verifyToken, roleVerifier(['admin']), business.deleteBusinessUser);

module.exports = router;
