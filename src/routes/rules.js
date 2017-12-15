// rules endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger('http');
var rules = require('../models/rules');
var tokenVerifier = require('../middlewares/businessTokenVerifier');
var roleVerifier = require('../middlewares/roleVerifier');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// POST /test
router.post('/test', rules.test);

// POST /run
router.post(
	'/run',
	tokenVerifier.verifyToken,
	roleVerifier(['admin']),
	rules.run
);

// POST /:ruleId/run
router.post(
	'/:ruleId/run',
	tokenVerifier.verifyToken,
	roleVerifier(['admin']),
	rules.runRule
);

// POST /
router.post(
	'/',
	tokenVerifier.verifyToken,
	roleVerifier(['admin', 'manager']),
	rules.postRule
);

// GET /
router.get(
	'/',
	tokenVerifier.verifyToken,
	roleVerifier(['admin', 'manager', 'user']),
	rules.getRules
);

// GET /:ruleId
router.get(
	'/:ruleId',
	tokenVerifier.verifyToken,
	roleVerifier(['admin', 'manager', 'user']),
	rules.getRule
);

// PUT /:ruleId
router.put(
	'/:ruleId',
	tokenVerifier.verifyToken,
	roleVerifier(['admin', 'manager']),
	rules.updateRule
);

// DELETE /:ruleId
router.delete(
	'/:ruleId',
	tokenVerifier.verifyToken,
	roleVerifier(['admin', 'manager']),
	rules.deleteRule
);

// GET /:ruleId/commits
router.get(
	'/:ruleId/commits',
	tokenVerifier.verifyToken,
	roleVerifier(['admin', 'manager']),
	rules.getRuleCommits
);

// GET /:ruleId/commits/commitId
router.get(
	'/:ruleId/commits/:commitId',
	tokenVerifier.verifyToken,
	roleVerifier(['admin', 'manager']),
	rules.getRuleStateInCommit
);

module.exports = router;
