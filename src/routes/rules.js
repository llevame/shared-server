// rules endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("http");
var rules = require('../models/rules');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

router.post('/run', rules.run);

router.post('/:ruleId/run', rules.runRule);

router.post('/', rules.postRule);

router.get('/', rules.getRules);

router.get('/:ruleId', rules.getRule);

router.put('/:ruleId', rules.updateRule);

router.delete('/:ruleId', rules.deleteRule);

router.get('/:ruleId/commits', rules.getRuleCommits);

router.get('/:ruleId/commits/:commitId', rules.getRuleStateInCommit);

module.exports = router;
