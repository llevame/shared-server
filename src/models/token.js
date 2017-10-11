let authorization = require('./authorization');

// returns a new token for an app-server
function getToken(req, res) {
	var service = require('../libs/service');
	var log = require('log4js').getLogger("consola");
	if (!req.body.username || !req.body.password) {
		res.status(400)
		   .json(
			{
				code: 400,
				message: "Parámetros faltantes"
			}
			);
		return;
	}
	var result= authorization.authorizeUser(req.body);
	if (typeof result == 'string') {
		res.status(401)
		   .json(
			{
				code: 401,
				message: "Acceso no autorizado: " + result
			}
			);
		return;
	}
	res.status(201)
	   .json(
		{
			metadata: {
				version: "1.0"
			},
			token: {
				expiresAt: 2,
				token: service.createToken(req.body.username)
			}
		}
		);
}

module.exports = {getToken};
