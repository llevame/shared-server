// servers endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
let server = require('../models/server');
let tokenMidd = require('../middlewares/appTokenVerifier');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', server.getServers);

// POST /
router.post('/', server.postServer);

// GET /:serverId
router.get('/:serverId', server.getServer);

// POST /ping
router.post('/ping', tokenMidd.verifyPingToken, server.pingServer);

// POST /:serverId
router.post('/:serverId', server.resetServerToken);

// PUT /:serverId
router.put('/:serverId', server.updateServer);

// DELETE /:serverId
router.delete('/:serverId', server.deleteServer);

module.exports = router;
