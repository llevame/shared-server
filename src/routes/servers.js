// servers endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var server = require('../models/server');
var appTokenVerifier = require('../middlewares/appTokenVerifier');
var businessTokenVerifier = require('../middlewares/businessTokenVerifier');
var roleVerifier = require('../middlewares/roleVerifier');
var stat = require('../middlewares/statGenerator');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', businessTokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), server.getServers);

// POST /
router.post('/', businessTokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), server.postServer);

// GET /:serverId
router.get('/:serverId', businessTokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), server.getServer);

// POST /ping
router.post('/ping', appTokenVerifier.verifyPingToken, stat.generateStat, server.pingServer);

// POST /:serverId
router.post('/:serverId', businessTokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), server.resetServerToken);

// PUT /:serverId
router.put('/:serverId', businessTokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), server.updateServer);

// DELETE /:serverId
router.delete('/:serverId', businessTokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), server.deleteServer);

module.exports = router;
