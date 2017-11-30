var v = require('../../package.json').version;

function createPaymethodResponse(items) {
	let a = [];

	for (p in items) {
		let paym = {
			name: items[p].paymethod,
			parameters: items[p].parameters,
		};

		a.push(paym);
	}

	return {
		metadata: {
			count: items.length,
			total: items.length,
			version: v,
		},
		paymethods: a,
	};
}

module.exports = { createPaymethodResponse };
