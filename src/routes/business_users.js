// business-users endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("info");

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

router.get('/', (req, res) => {
	res.send('GET response on /business-users');
});

router.post('/', (req, res) => {
	res.send('POST response on /business-users');
});

router.put('/:userId', (req, res) => {
	res.send('PUT response on /business-users/' + req.params.userId);
});

router.delete('/:userId', (req, res) => {
	res.send('DELETE response on /business-users/' + req.params.userId);
});

module.exports = router;
