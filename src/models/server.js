let error = require('../handlers/error-handler');
let serverQ = require('../../db/queries-wrapper/server-queries');
let service = require('../libs/service');
let log = require('log4js').getLogger("error");
var v = require('../../package.json').version;

function checkParameters(body) {
	return (body.createdBy && body.createdTime && body.name);
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

			res.status(201).json(app_server);
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

// reset an app-server token
function resetServerToken(req, res) {

}

// updates information about a specific app-server
function updateServer(req, res) {

}

// deletes a specific app-server
function deleteServer(req, res) {

}

// used by an app-server to notify life and 
// to reset the token if needed (In this case the previous one
// is invalidated and can no longer be used)
function pingServer(req, res) {

}

module.exports = {getServers, postServer, getServer, resetServerToken, updateServer, deleteServer, pingServer};
