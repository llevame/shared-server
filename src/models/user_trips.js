// returns all the trips made by a specific user
function getTrips(req, res) {
	res.send('GET request on /users/' + req.params.userId + '/trips');
}

module.exports = {getTrips};
