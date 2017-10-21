// rules endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var rules = require('../models/rules');
var tokenVerifier = require('../middlewares/businessTokenVerifier');
var roleVerifier = require('../middlewares/roleVerifier');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

router.post('/run', tokenVerifier.verifyToken, roleVerifier(['admin']), rules.run);

router.post('/:ruleId/run', tokenVerifier.verifyToken, roleVerifier(['admin']), rules.runRule);

router.post('/', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), rules.postRule);

router.get('/', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), rules.getRules);

router.get('/:ruleId', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager', 'user']), rules.getRule);

router.put('/:ruleId', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), rules.updateRule);

router.delete('/:ruleId', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), rules.deleteRule);

router.get('/:ruleId/commits', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), rules.getRuleCommits);

router.get('/:ruleId/commits/:commitId', tokenVerifier.verifyToken, roleVerifier(['admin', 'manager']), rules.getRuleStateInCommit);

module.exports = router;
