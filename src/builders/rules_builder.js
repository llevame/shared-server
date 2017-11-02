var v = require('../../package.json').version;

function createRule(r) {

	return {
		id: r.id,
		_ref: r._ref,
		language: 'node-rules/javascript',
		lastCommit: {
			author: r.author,
			message: r.message,
			timestamp: r.timestamp
		},
		blob: r.blob,
		active: r.active
	};
}

function createGetAllResponse(rules) {
	
	let rs = rules.map(createRule);

	return {
		metadata: {
			count: rs.length,
			total: rs.length,
			version: v
		},
		rules: rs
	};
}

function createResponse(r) {
	
	let rs = createRule(r);

	return {
		metadata: {
			version: v
		},
		rule: rs
	};
}

module.exports = {createGetAllResponse, createResponse};