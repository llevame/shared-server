// middleware that verifies business-user´s roles

var error = require('../handlers/error-handler');

module.exports = function(validRoles) {

	return function(req, res, next, validRoles) {
		
		// code to verify that the role/s given in the token
		// are the ones that got permission in a specific
		// endpoint.
		// In this case, the 'roles' array in the token has to
		// contain at least one of the roles that are valid to use
		// this endpoint (th ones defined in 'validRoles' array).

		next();
	}
};
