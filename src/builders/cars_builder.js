var v = require('../../package.json').version;

function createGetAllResponse(c) {

	return {
		metadata: {
			count: c.length,
			total: c.length,
			version: v
		},
		cars: c
	};
}

function createResponse(c) {

	return {
		metadata: {
			version: v
		},
		car: c
	};
}

module.exports = {createGetAllResponse, createResponse};
