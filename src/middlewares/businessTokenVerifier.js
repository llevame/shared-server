// middleware that verifies business-user tokens

var error = require('../handlers/error-handler');
var env = require('node-env-file');
var process = env(__dirname + '/../../process.env');
var jwt = require('jsonwebtoken');
var moment = require('moment');

// verify that the given token is a valid
// business-user token. In this case, that means
// that it was created using the BUSINESS_TOKEN_SECRET_KEY and
// it must not be expired
function verifyToken(req, res, next) {

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

module.exports = {verifyToken};
