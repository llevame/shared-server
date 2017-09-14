// returns all the available app-servers
function getServers(req, res) {
	res.status(201)
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
			servers: [
				{
					id: "0",
					_ref: "0",
					createdBy: "admin",
					createdTime: 0,
					name: "server0",
					lastConnection: "0"
				},
			]
		}
		);
}

// post a new app-server
function postServer(req, res) {
	
	if (!req.body.createdBy || !req.body.createdTime || !req.body.name) {
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
			server: {
				server: {
					id: "0",
					_ref: "",
					createdBy: req.body.createdBy,
					createdTime: req.body.createdTime,
					name: req.body.name,
					lastConnection: 0
				},
				token: {
					expiresAt: 0,
					token: "appserv1"
				}
			}
		 }
		);
}

module.exports = {getServers, postServer};
