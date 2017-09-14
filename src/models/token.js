let authorization = require('./authorization');

// returns a new token for an app-server
function getToken(req, res) {
	
	if (!authorization.authorizeUser(req.body)) {
		res.status(401)
		   .json(
			{
				code: 401,
				message: "Acceso no autorizado"
			}
			);
		return;
	}
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
	res.status(201)
	   .json(
		{
			metadata: {
				version: "1.0"
			},
			token: {
				expiresAt: 0,
				token: "token"
			}
		}
		);
}

module.exports = {getToken};
