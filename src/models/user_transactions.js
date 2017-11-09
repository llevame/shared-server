var error = require('../handlers/error-handler');
var transactionQ = require('../../db/queries-wrapper/transaction_queries');
var v = require('../../package.json').version;
var log = require('log4js').getLogger("error");

// returns all the transactions made by a user
function getTransactions(req, res) {

	transactionQ.getAllOfUser(req.params.userId)
		.then((trans) => {
			
			let ts = {
				metadata: {
					count: trans.length,
					total: trans.length,
					version: v
				},
				transactions: trans
			};

			res.status(200).json(ts);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// post a new transaction into a specific user
function postTransaction(req, res) {

	transactionQ.add(req.params.userId)
		.then((transId) => {
			return transactionQ.get(transId);
		})
		.then((trans) => {
			
			let t = {
				metadata: {
					version: v
				},
				transaction: trans
			};

			res.status(200).json(t);
		})
		.catch((err) => {
			log.error("Error: " + err.message + "on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {getTransactions, postTransaction};

