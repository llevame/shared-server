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
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

// post a new transaction into a specific user
function postTransaction(req, res) {

	transactionQ.getLast(req.params.userId)
		.then((timestamp) => {
			transactionQ.getByTimestamp(timestamp)
				.then((trans) => {
					transactionQ.addTransactionTrip(req.params.userId, trans.trip, trans.cost * (-1), trans.data)
						.then((transId) => {
							return transactionQ.get(transId);
						})
						.then((t) => {
							let t = {
								metadata: {
									version: v
								},
								transaction: {
									id: t.id,
									trip: t.trip,
									timestamp: t.timestamp,
									cost: {
										currency: "ARS",
										value: t.cost
									},
									description: t.description,
									data: t.data
								}
							};
							res.status(200).json(t);
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

module.exports = {getTransactions, postTransaction};

