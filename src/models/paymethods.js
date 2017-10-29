var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");
var request = require('request-promise');

function getPaymethods(req, res) {

	const postOptions = {
		method: 'POST',
		uri: 'http://shielded-escarpment-27661.herokuapp.com/api/v1/user/oauth/authorize',
		body: {
			client_id: "342d9628-bf54-4a5a-adaa-4421872aacd9",
  			client_secret: "f82119c5-7aab-406c-a89b-4595e2a61c09"
		},
		json: true
	};

	request(postOptions)
		.then((response) => {

			const getOptions = {
				method: 'GET',
				uri: 'https://shielded-escarpment-27661.herokuapp.com/api/v1/paymethods',
				headers: {
					'Authorization': 'Bearer ' + response.body.access_token
				},
				json: true
			};

			request(getOptions)
				.then((r) => {
					res.status(200).json(r.body);
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
/*
	res.status(200).json({
		type: 'GET',
		url: '/api/paymethods'
	});
*/
}

module.exports = {getPaymethods};
