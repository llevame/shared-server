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

module.exports = {verifyToken};
