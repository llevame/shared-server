let error = require('../handlers/error-handler');
let serverQ = require('../../db/queries-wrapper/server-queries');
let log = require('log4js').getLogger("error");
var v = require('../../package.json');

function checkParameters(body) {
	return (body.createdBy && body.createdTime && body.name);
}

// returns all the available app-servers
function getServers(req, res) {
	res.status(201).json();
}

// post a new app-server
function postServer(req, res) {
	
	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}
	res.status(201).json();
}

// get information about a specific app-server
function getServer(req, res) {
	
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
