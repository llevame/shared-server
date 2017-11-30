// middleware that generates an entry in the stats database table
// with the app_server_id, endpoint and method

var urlParser = require('url');
var moment = require('moment');
var log = require('log4js').getLogger('error');
var error = require('../handlers/error-handler');
var statsQ = require('../../db/queries-wrapper/stats_queries');

function generateStat(req, res, next) {
	if (!process.env.NODE_ENV.includes('test')) {
		let stat = {
			app_id: req.user.id,
			endpoint: urlParser.parse(req.originalUrl).pathname,
			method: req.method,
			madeTime: moment().unix(),
		};

		statsQ
			.add(stat)
			.then(() => {
				next();
			})
			.catch(err => {
				log.error('Error: ' + err.message + ' on: ' + req.originalUrl);
				return res.status(500).json(error.unexpected(err));
			});
	} else {
		next();
	}
}

module.exports = { generateStat };
