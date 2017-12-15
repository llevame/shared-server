var error = require('../handlers/error-handler');
var builder = require('../builders/paymethods_builder');
var log = require('log4js').getLogger('error');
var request = require('request-promise');

function getPaymethods(req, res) {
	const postOptions = {
		method: 'POST',
		uri:
			'http://shielded-escarpment-27661.herokuapp.com/api/v1/user/oauth/authorize',
		body: {
			client_id: process.env.PAYMETHOD_CLIENT_ID,
			client_secret: process.env.PAYMETHOD_CLIENT_SECRET,
		},
		json: true,
	};

	request(postOptions)
		.then(body => {
			const getOptions = {
				method: 'GET',
				uri:
					'https://shielded-escarpment-27661.herokuapp.com/api/v1/paymethods',
				headers: {
					Authorization: 'Bearer ' + body.access_token,
				},
				json: true,
			};

			request(getOptions)
				.then(b => {
					res
						.status(200)
						.json(builder.createPaymethodResponse(b.items));
				})
				.catch(err => {
					log.error(
						'Error: ' + err.message + ' on: ' + req.originalUrl
					);
					res.status(500).json(error.unexpected(err));
				});
		})
		.catch(err => {
			log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

function generatePayment(data) {
	const postOptions = {
		method: 'POST',
		uri:
			'http://shielded-escarpment-27661.herokuapp.com/api/v1/user/oauth/authorize',
		body: {
			client_id: process.env.PAYMETHOD_CLIENT_ID,
			client_secret: process.env.PAYMETHOD_CLIENT_SECRET,
		},
		json: true,
	};

	request(postOptions)
		.then(body => {
			const postPayOptions = {
				method: 'POST',
				uri:
					'https://shielded-escarpment-27661.herokuapp.com/api/v1/payments',
				headers: {
					Authorization: 'Bearer ' + body.access_token,
					'Content-Type': 'application/json',
				},
				body: {
					currency: data.currency,
					value: data.value,
					paymentMethod: data.paymethod.parameters,
				},
				json: true,
			};

			request(postPayOptions)
				.then(b => {
					return b.transaction_id;
				})
				.catch(err => {
					log.error('Error: ' + err.message);
					return error.unexpected(err);
				});
		})
		.catch(err => {
			log.error('Error: ' + err.message);
			return error.unexpected(err);
		});
}

module.exports = { getPaymethods, generatePayment };
