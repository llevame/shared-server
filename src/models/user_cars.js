// returns all the cars of a specific user
function getCars(req, res) {
	res.send('GET request on /users/' + req.params.userId + '/cars');
}

// post a new car of a specific user
function postCar(req, res) {
	res.send('POST request on /users/' + req.params.userId + '/cars');
}

// returns information about a specif car of a user
function getCar(req, res) {
	res.send('GET request on /users/' + req.params.userId + '/cars/' + req.params.carId);
}

// updates the information of a specific car of a user
function updateCar(req, res) {
	res.send('PUT request on /users/' + req.params.userId + '/cars/' + req.params.carId);
}

// delete a car of a specific user
function deleteCar(req, res) {
	res.send('DELETE request on /users/' + req.params.userId + '/cars/' + req.params.carId);
}

module.exports = {getCars, postCar, getCar, updateCar, deleteCar};

