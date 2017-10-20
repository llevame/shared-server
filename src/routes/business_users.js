// business-users endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var business = require('../models/business');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

router.get('/me', business.getConnectedBusinessUser);

router.put('/me', business.updateConnectedBusinessUser);

router.get('/', business.getBusinessUsers);

router.post('/', business.postBusinessUser);

router.get('/:userId', business.getBusinessUser);

router.put('/:userId', business.updateBusinessUser);

router.delete('/:userId', business.deleteBusinessUser);

module.exports = router;
