var jwt = require('jsonwebtoken');
var moment = require('moment');
var env = require('node-env-file');
var process = env(__dirname + '/../../process.env');
var expiration = moment()
	.add(2, 'days')
	.unix();

function createAppToken(appUser) {
	var payload = {
		id: appUser.id,
		iat: moment().unix(),
		exp: expiration,
	};

	return jwt.sign(payload, process.APP_TOKEN_SECRET_KEY);
}

function createBusinessToken(businessUser) {
	var payload = {
		id: businessUser.id,
		roles: businessUser.roles,
		iat: moment().unix(),
		exp: expiration,
	};

	return jwt.sign(payload, process.BUSINESS_TOKEN_SECRET_KEY);
}

module.exports = { createAppToken, createBusinessToken, expiration };
