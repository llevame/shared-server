var v = require('../../package.json').version;

function createResponse(r) {
	
	return {
		metadata: {
			version: v
		},
		rule: {
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
		}
	};
}

module.exports = {createResponse};