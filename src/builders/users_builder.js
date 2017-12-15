var v = require('../../package.json').version;

function createGetAllResponse(u) {
	return {
		metadata: {
			count: u.length,
			total: u.length,
			version: v,
		},
		users: u,
	};
}

function createResponse(u, cars) {
	u.cars = cars;

	return {
		metadata: {
			version: v,
		},
		user: u,
	};
}

module.exports = { createResponse, createGetAllResponse };
