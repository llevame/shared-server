// returns all the available users
function getUsers(req, res) {
	res.send('GET request on /users');
}

// post a new user into the system
function postUser(req, res) {
	res.send('POST request on /users');
}

// validate a user
function validateUser(req, res) {
	res.send('POST request on /users/validate');
}

// delete a user
function deleteUser(req, res) {
	res.send('DELETE request on /users/' + req.params.userId);
}

// returns information about a specific user
function getUser(req, res) {
	res.send('GET request on /users/' + req.params.userId);
}

// updates information of a user
function updateUser(req, res) {
	res.send('PUT request on /users/' + req.params.userId);
}

module.exports = {getUsers, getUser, postUser, validateUser, deleteUser, updateUser};
