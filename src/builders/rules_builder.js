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

function createCommit(c) {
	
	return {
		id: c.id,
		author: c.author,
		message: c.message,
		timestamp: c.timestamp
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

function createCommitsResponse(commits) {
	
	let cs = commits.map(createCommit);

	return {
		metadata: {
			count: cs.length,
			total: cs.length,
			version: v
		},
		commits: cs
	};
}

function createRuleStateInCommit(commit) {
	
	return {
		metadata: {
			version: v
		},
		rule: {
			id: commit.rule_id,
			language: 'node-rules/javascript',
			lastCommit: {
				id: commit.id,
				author: commit.author,
				message: commit.message,
				timestamp: commit.timestamp
			},
			blob: commit.rule
			//active: commit.active
		}
	};
}

module.exports = {createGetAllResponse, createResponse,
	createCommitsResponse, createRuleStateInCommit};