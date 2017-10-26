var v = require('../../package.json').version;
var service = require('../libs/service');

function createTokenResponse(bu) {
	
	return {
		metadata: {
			version: v
		},
		token: {
			expiresAt: service.expiration,
			token: service.createBusinessToken(bu)
		}
	};
}

module.exports = {createTokenResponse};