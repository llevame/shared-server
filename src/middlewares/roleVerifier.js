// middleware that verifies business-user´s roles

var error = require('../handlers/error-handler');

module.exports = (validRoles) => {

	return (req, res, next) => {

		// code to verify that the role/s given in the token
		// are the ones that got permission in a specific
		// endpoint.
		// In this case, the 'roles' array in the token has to
		// contain at least one of the roles that are valid to use
		// in this endpoint (the ones defined in 'validRoles' array).

		let valid = req.user.roles.some((role) => {
			return (validRoles.findIndex((r) => {
				return (r === role);
			}) >= 0);
		});

		if (!valid) {
			return res.status(401).json(error.unathoAccess());
		}

		next();
	}
};
