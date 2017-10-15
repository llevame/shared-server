// middleware that verifies app-server tokens
var error = require('../handlers/error-handler');
var env = require('node-env-file');
var process = env(__dirname + '/../../process.env');
var jwt = require('jsonwebtoken');
var log = require('log4js').getLogger("info");

function verifyToken(req, res, next) {

	next();
}

function verifyPingToken(req, res, next) {

	log.info("middleware entering");

	if (!req.query || !req.query.token) {
		return res.status(401).json(error.unathoAccess());
	}

	jwt.verify(req.query.token, process.APP_TOKEN_SECRET_KEY, (err, decoded) => {
		
		if (err) {
			return res.status(401).json(error.invalidToken(err));
		}
		
		log.info("valid token check");
		log.info("id: %d, exp: %d", decoded.id, decoded.exp);

		req.user = decoded;
		next();
	});
}

module.exports = {verifyToken, verifyPingToken};
