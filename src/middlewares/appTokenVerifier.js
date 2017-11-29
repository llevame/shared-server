// middleware that verifies app-server tokens

var error = require('../handlers/error-handler');
var env = require('node-env-file');
var process = env(__dirname + '/../../process.env');
var jwt = require('jsonwebtoken');
var moment = require('moment');

function verifier(req, res, next, ping) {

	if (!req.query || !req.query.token) {
		return res.status(401).json(error.unathoAccess());
	}

	jwt.verify(req.query.token, process.APP_TOKEN_SECRET_KEY, (err, decoded) => {
		
		if (err) {
			if (err.message === 'jwt expired') {
				if (ping !== 'ping') {
					res.status(401).json(error.invalidToken(err));
				} else {
					req.user = jwt.decode(req.query.token);
					next();
				}
			} else {
				jwt.verify(req.query.token, process.BUSINESS_TOKEN_SECRET_KEY, (e, dec) => {
					if (e) {
						res.status(401).json(error.invalidToken(e));
					} else {
						req.user = dec;
						next();
					}
				});
			}
		} else {
			req.user = decoded;
			next();
		}
	});
}

function verifyToken(req, res, next) {

	verifier(req, res, next, 'no ping');
}

function verifyPingToken(req, res, next) {

	verifier(req, res, next, 'ping');
}

module.exports = {verifyToken, verifyPingToken};
