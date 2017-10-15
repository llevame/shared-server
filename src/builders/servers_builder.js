var v = require('../../package.json').version;

function createGetAllResponse(srvs) {

	return {
		metadata: {
			count: srvs.length,
			total: srvs.length,
			version: v
		},
		servers: srvs
	};
}

function createPostResponse(s, exp, tok) {

	return {
		metadata: {
			version: v
		},
		server: {
			server: s,
			token: {
				expiresAt: exp,
				token: tok
			}
		}
	};
}

function createResponse(s) {

	return {
		metadata: {
			version: v
		},
		server: s
	};
}

function createPingResponse(s, exp, tok) {

	return {
		metadata: {
			version: v
		},
		ping: {
			server: s,
			token: {
				expiresAt: exp,
				token: tok
			}
		}
	};
}

module.exports = {createGetAllResponse, createPostResponse, createPingResponse, createResponse};
