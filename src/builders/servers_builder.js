var v = require('../../package.json').version;
var moment = require('moment');

function createGetAllResponse(srvs) {

	srvs = srvs.map((s) => {
		s.lastConnection = moment(s.lastConnection).unix();
		return s;
	});

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

	s.lastConnection = moment(s.lastConnection).unix();

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

	s.lastConnection = moment(s.lastConnection).unix();

	return {
		metadata: {
			version: v
		},
		server: s
	};
}

function createPingResponse(s, exp, tok) {

	s.lastConnection = moment(s.lastConnection).unix();

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
