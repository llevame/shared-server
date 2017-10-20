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
			return res.status(401).json(error.invalidToken(err));
		}
		
		if (!(ping === 'ping') && (decoded.exp < moment().unix())) {
			return res.status(401).json(error.invalidToken(err));
		}

		req.user = decoded;
		next();
	});
}

function verifyToken(req, res, next) {

	verifier(req, res, next, 'no ping');
}

function verifyPingToken(req, res, next) {

	verifier(req, res, next, 'ping');
}

module.exports = {verifyToken, verifyPingToken};
