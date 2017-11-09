var v = require('../../package.json').version;

function createGetAllResponse(t) {

	return {
		metadata: {
			count: t.length,
			total: t.length,
			version: v
		},
		trips: t
	};
}

function createResponse(t, currency, costValue) {

	t.cost = {
		currency: currency,
		value: costValue
	};

	return {
		metadata: {
			version: v
		},
		trip: t
	};
}

module.exports = {createResponse, createGetAllResponse};
