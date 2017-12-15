var v = require('../../package.json').version;

function createGetAllResponse(t) {
	return {
		metadata: {
			count: t.length,
			total: t.length,
			version: v,
		},
		trips: t,
	};
}

function createResponse(t, currency, costValue) {
	t.cost = {
		currency: currency,
		value: costValue,
	};

	t.totalTime = t.waitTime + t.travelTime;

	return {
		metadata: {
			version: v,
		},
		trip: t,
	};
}

function createEstimateResponse(currency, costValue) {
	return {
		metadata: {
			version: v,
		},
		cost: {
			currency: currency,
			value: costValue,
		},
	};
}

module.exports = {
	createResponse,
	createGetAllResponse,
	createEstimateResponse,
};
