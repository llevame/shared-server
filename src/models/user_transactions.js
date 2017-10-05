// returns all the transactions made by a user
function getTransactions(req, res) {
	res.send('GET request on /users/' + req.params.userId + '/transactions');
}

// post a new transaction into a specific user
function postTransaction(req, res) {
	res.send('POST request on /users/' + req.params.userId + '/transactions');
}

module.exports = {getTransactions, postTransaction};

