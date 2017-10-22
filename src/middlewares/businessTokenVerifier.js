// middleware that verifies business-user tokens

var error = require('../handlers/error-handler');
var env = require('node-env-file');
var process = env(__dirname + '/../../process.env');
var jwt = require('jsonwebtoken');
var moment = require('moment');

function verifyToken(req, res, next) {

	// code to verify that the given token is a
	// valid business-user token.
	// In this case, it has to be "verified" with the
	// secret key BUSINESS_TOKEN_SECRET_KEY and it can not
	// be expirated -> (token.exp < now)

	next();
}

// 'verifyToken' will do exactly the same 
// as this function does now
function verifyTokenMe(req, res, next) {

	if (!req.query || !req.query.token) {
		return res.status(401).json(error.unathoAccess());
	}

	jwt.verify(req.query.token, process.BUSINESS_TOKEN_SECRET_KEY, (err, decoded) => {
		
		if (err) {
			return res.status(401).json(error.invalidToken(err));
		}
		
		if (decoded.exp < moment().unix()) {
			return res.status(401).json(error.invalidToken(err));
		}

		req.user = decoded;
		next();
	});
}

module.exports = {verifyToken, verifyTokenMe};
