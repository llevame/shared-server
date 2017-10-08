let authorization = require('./authorization');
let businessUserQ = require('../../db/business_queries');

function businessUserExists(userId) {
	return true;
}

function existsUpdateConflict(userId) {
	return false;
}

function checkParameters(body) {
	return (body.username && body.password &&
		body.name && body.surname &&
		body.roles);
}

// returns all the available business users in the system
function getBusinessUsers(req, res) {
	res.status(200)
	   .json(
		{
			metadata: {
				count: 1,
				total: 3,
				next: "",
				prev: "",
				first: "",
				last: "",
				version: "1.0"
			},
			businessUser: [
				{
					id: "0",
					_ref: "0",
					username: "bussuser",
					password: "password",
					name: "businessUser",
					surname: "surname",
					roles: [
						"admin"
					]
				}
			]
		}
		);
}

// post a new business users
function postBusinessUser(req, res) {

	if (!checkParameters(req.body)) {
		
		res.status(400)
		   .json(
			{
				code: 400,
				message: "Parámetros faltantes"
			}
			);
		return;
	}

	businessUserQ.addBusinessUser(req.body)
		.then((userId) => {
			return businessUserQ.getBusinessUser(userId);
		})
		.then((bu) => {
			res.status(201).json(bu);
		})
		.catch((error) => {
			res.status(500)
				.json(
				     {
				     	code: error,
					message: error.message
				     }
				     );
		});
}

// updates a business user
function updateBusinessUser(req, res) {
	
	if (!checkParameters(req.body)) {
		
		res.status(400)
		   .json(
			{
				code: 400,
				message: "Parámetros faltantes"
			}
			);
		return;
	}
	if (!businessUserExists(req.params.userId)) {
		res.status(404)
		   .json(
			{
				code: 404,
				message: "No existe el recurso solicitado"
			}
			);
		return;
	}
	if (existsUpdateConflict(req.params.userId)) {
		res.status(409)
		   .json(
			{
				code: 409,
				message: "Conflicto en el update"
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
			businessUser: {
				id: "" + req.params.userId,
				_ref: "0",
				username: req.body.username,
				password: req.body.password,
				name: req.body.name,
				surname: req.body.surname,
				roles: req.body.roles
			}
		}
		);
}

// deletes a business user
function deleteBusinessUser(req, res) {
	
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
	if (!businessUserExists(req.params.userId)) {
		res.status(404)
		   .json(
			{
				code: 404,
				message: "No existe el recurso solicitado"
			}
			);
		return;
	}
	res.status(204)
	   .send("Baja exitosa");
}

module.exports = {getBusinessUsers, postBusinessUser, updateBusinessUser, deleteBusinessUser};
