var error = require('../handlers/error-handler');
var serverQ = require('../../db/queries-wrapper/server_queries');
var appTokenQ = require('../../db/queries-wrapper/app_token_queries');
var invalidTokensQ = require('../../db/queries-wrapper/invalid_tokens_queries');
var builder = require('../builders/servers_builder');
var service = require('../libs/service');
var knex = require('../../db/knex');
var log = require('log4js').getLogger("error");
var moment = require('moment');

function checkParameters(body) {
	return (body.createdBy && body.createdTime && body.name);
}

function checkParametersUpdate(body) {
	return (body._ref && body.name);
}

// returns all the available app-servers
function getServers(req, res) {

	serverQ.getAll()
		.then((servers) => {
			let r = builder.createGetAllResponse(servers);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// post a new app-server
function postServer(req, res) {
	
	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	serverQ.add(req.body)
		.then((serverId) => {
			return serverQ.get(serverId);
		})
		.then((srv) => {
			let token = service.createAppToken(srv);
			let r = builder.createPostResponse(srv, service.expiration, token);

			appTokenQ.add(srv.id, token)
				.then(() => {
					res.status(201).json(r);
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// get information about a specific app-server
function getServer(req, res) {

	serverQ.get(req.params.serverId)
		.then((s) => {
			if (!s) {
				return res.status(404).json(error.noResource());
			}
			let r = builder.createResponse(s);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// resets an app-server token and
// invalidates the previous one
function resetServerToken(req, res) {

	serverQ.get(req.params.serverId)
		.then((srv) => {
			if (!srv) {
				return res.status(404).json(error.noResource());
			}

			appTokenQ.getByServer(srv.id)
				.then((tok) => {
					return invalidTokensQ.add(tok);
				})
				.then(() => {
					let token = service.createAppToken(srv);
					let r = builder.createPostResponse(srv, service.expiration, token);
					
					appTokenQ.update(srv.id, token)
						.then(() => {
							res.status(201).json(r);
						})
						.catch((err) => {
							log.error("Error: " + err.message + " on: " + req.originalUrl);
							res.status(500).json(error.unexpected(err));
						});
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// updates information about a specific app-server
function updateServer(req, res) {

	if (!checkParametersUpdate(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	serverQ.get(req.params.serverId)
		.then((server) => {
			if (!server) {
				return res.status(404).json(error.noResource());
			}

			if (server._ref !== req.body._ref) {
				return res.status(409).json(error.updateConflict());
			}

			serverQ.update(req.params.serverId, req.body)
				.then((updatedServer) => {
					let r = builder.createResponse(updatedServer[0]);
					res.status(200).json(r);
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// deletes a specific app-server
function deleteServer(req, res) {

	serverQ.get(req.params.serverId)
		.then((server) => {
			if (!server) {
				return res.status(404).json(error.noResource());
			}

			serverQ.del(req.params.serverId)
				.then(() => {
					res.sendStatus(204);
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// used by an app-server to notify life and 
// to reset the token if needed (In this case the previous one
// is invalidated and can no longer be used)
function pingServer(req, res) {

	var id = req.user.id;
	var now = moment().unix();
	
	serverQ.updatePing(id, {lastConnection: knex.fn.now()})
		.then((updatedServer) => {
			if (req.user.exp < now) {
				invalidTokensQ.add(req.query.token)
					.then(() => {
						let token = service.createAppToken(updatedServer[0]);
						let r = builder.createPingResponse(updatedServer[0], service.expiration, token);
						appTokenQ.update(id, token)
							.then(() => {
								res.status(201).json(r);
							})
							.catch((err) => {
								log.error("Error: " + err.message + " on: " + req.originalUrl);
								res.status(500).json(error.unexpected(err));
							});
					})
					.catch((err) => {
						log.error("Error: " + err.message + " on: " + req.originalUrl);
						res.status(500).json(error.unexpected(err));
					});
			} else {
				let r = builder.createPingResponse(updatedServer[0], req.user.exp, req.query.token);
				res.status(201).json(r);
			}
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getServers, postServer, getServer, resetServerToken, updateServer, deleteServer, pingServer};
