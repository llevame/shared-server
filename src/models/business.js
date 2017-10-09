let authorization = require('./authorization');
let businessUserQ = require('../../db/queries-wrapper/business_queries');
var v = require('../../package.json').version;

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
	
	businessUserQ.getAll()
		.then((users) => {

			let busers = {
			
				metadata: {
					count: users.length,
					total: users.length,
					version: v
				},
				businessUser: users
			};

			res.status(200).json(busers);
		})
		.catch((error) => {
			res.status(500).json({
				code: error.status,
				message: error.message
			});
		});
}

// post a new business users
function postBusinessUser(req, res) {

	if (!checkParameters(req.body)) {
		return res.status(400).json({
			code: 400,
			message: "Parámetros faltantes"
		});
	}

	businessUserQ.addBusinessUser(req.body)
		.then((userId) => {
			return businessUserQ.getBusinessUser(userId);
		})
		.then((bu) => {

			let buser = {
				metadata: {
					version: v
				},
				businessUser: bu
			};

			res.status(201).json(buser);
		})
		.catch((error) => {
			res.status(500).json({
				code: error.status,
				message: error.message
			});
		});
}

// updates a business user
function updateBusinessUser(req, res) {
	
	if (!checkParameters(req.body)) {
		return res.status(400).json({
			code: 400,
			message: "Parámetros faltantes"
		});
	}

	if (req.body.hasOwnProperty('id')) {
		return res.status(500).json({
			code: 500,
			message: "No se puede actualizar el campo id"
		});
	}

	businessUserQ.getBusinessUser(req.params.userId)
		.then((user) => {
			if (!user) {
				return res.status(404).json({
					code: 404,
					message: "No existe el recurso solicitado"
				});
			}

			if (user._ref !== req.body._ref) {
				return res.status(409).json({
					code: 409,
					message: "Conflicto en el update"
				});
			}

			businessUserQ.updateBusinessUser(req.params.userId, req.body)
				.then((updatedUser) => {

					let update = {
						metadata: {
							version: v
						},
						businessUser: updatedUser
					};

					res.status(200).json(update);
				})
				.catch((error) => {
					res.status(500).json({
						code: 500,
						message: error.message
					});
				});
		});
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
