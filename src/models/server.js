let error = require('../handlers/error-handler');
let serverQ = require('../../db/queries-wrapper/server_queries');
let appTokenQ = require('../../db/queries-wrapper/app_token_queries');
let invalidTokensQ = require('../../db/queries-wrapper/invalid_tokens_queries');
let service = require('../libs/service');
let log = require('log4js').getLogger("error");
let cons = require('log4js').getLogger("consola");
var v = require('../../package.json').version;

function checkParameters(body) {
	return (body.createdBy && body.createdTime && body.name);
}

function checkParametersUpdate(body) {
	return (body._ref && body.name);
}

// returns all the available app-servers
function getServers(req, res) {

	serverQ.getAll()
		.then((srvs) => {
			let app_servers = {
				metadata: {
					count: srvs.length,
					total: srvs.length,
					version: v
				},
				servers: srvs
			};
			res.status(200).json(app_servers);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
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
			
			let app_server = {
				metadata: {
					version: v
				},
				server: {
					server: srv,
					token: {
						expiresAt: service.expiration,
						token: service.createAppToken(srv)
					}
				}
			};

			appTokenQ.add(srv.id, app_server.server.token.token)
				.then(() => {
					res.status(201).json(app_server);
				})
				.catch((err) => {
					log.error("Error: " + err.message + "on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
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

			let srv = {
				metadata: {
					version: v
				},
				server: s
			};

			res.status(200).json(srv);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
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
					let app_server = {
						metadata: {
							version: v
						},
						server: {
							server: srv,
							token: {
								expiresAt: service.expiration,
								token: service.createAppToken(srv)
							}
						}
					};
					
					appTokenQ.update(srv.id, app_server.server.token.token)
						.then(() => {
							res.status(201).json(app_server);
						})
						.catch((err) => {
							log.error("Error: " + err.message + "on: " + req.originalUrl);
							res.status(500).json(error.unexpected(err));
						});
				})
				.catch((err) => {
					log.error("Error: " + err.message + "on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
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
					
					let update = {
						metadata: {
							version: v
						},
						server: updatedServer
					};

					res.status(200).json(update);
				})
				.catch((err) => {
					log.error("Error: " + err.message + "on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
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
					log.error("Error: " + err.message + "on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// used by an app-server to notify life and 
// to reset the token if needed (In this case the previous one
// is invalidated and can no longer be used)
function pingServer(req, res) {

	var id = req.user.id;
	cons.info("server id: %d", id);
	var now = moment().unix();
	
	serverQ.updatePing(id, {lastConnection: knex.fn.now()})
		.then((updatedServer) => {
			console.log("succesful update of last connection");
			if (req.user.exp < now) {
				invalidTokensQ.add(req.query.token)
					.then(() => {
						let app_server = {
							metadata: {
								version: v
							},
							ping: {
								server: updatedServer,
								token: {
									expiresAt: service.expiration,
									token: service.createAppToken(updatedServer)
								}
							}
						};
					
						appTokenQ.update(srv.id, app_server.server.token.token)
							.then(() => {
								res.status(201).json(app_server);
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
				let app_server_old_token = {
					metadata: {
						version: v
					},
					ping: {
						server: updatedServer,
						token: {
							expiresAt: req.user.exp,
							token: req.query.token
						}
					}
				};

				res.status(201).json(app_server_old_token);
			}
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getServers, postServer, getServer, resetServerToken, updateServer, deleteServer, pingServer};
