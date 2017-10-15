var v = require('../../package.json').version;

function createGetAllResponse(users) {

	return {
		metadata: {
			count: users.length,
			total: users.length,
			version: v
		},
		businessUser: users
	};
}

function createResponse(user) {
	
	return {
		metadata: {
			version: v
		},
		businessUser: user
	};
}

module.exports = {createGetAllResponse, createResponse};
