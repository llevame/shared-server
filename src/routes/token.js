// Token endpoint

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("info");

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// POST /
router.post('/', (req, res) => {
	if (!req.body) {
		res.status(400)
		   .json(
			{
				code: 400,
				message: "Parámetros faltantes"
			}
			);
		return;
	}
	res.status(201)
	   .json(
		{
			metadata: {
				version: "1.0"
			},
			token: {
				expiresAt: 0,
				token: "token"
			}
		}
		);
});

module.exports = router;
