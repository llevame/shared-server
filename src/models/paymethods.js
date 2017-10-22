var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");

function getPaymethods(req, res) {

	res.status(200).json({
		type: 'GET',
		url: '/api/paymethods'
	});
}

module.exports = {getPaymethods};