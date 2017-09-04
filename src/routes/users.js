// users endpoints

var express = require('express');
var router = express.Router();

// middleware specific to this router
router.use((req, res, next) => {
	console.log('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', (req, res) => {
	res.send('GET request on /users');
});

// POST /
router.post('/', (req, res) => {
	res.send('POST request on /users');
});

// GET /validate
router.get('/validate', (req, res) => {
	res.send('POST request on /users/validate');
});

// DELETE /{userId}
router.delete('/:userId', (req, res) => {
	res.send('DELETE request on /users/' + req.params.userId);
});

// GET /{userId}
router.get('/:userId', (req, res) => {
	res.send('GET request on /users/' + req.params.userId);
});

// PUT /{userId}
router.put('/:userId', (req, res) => {
	res.send('PUT request on /users/' + req.params.userId);
});

// GET /{userId}/cars
router.get('/:userId/cars', (req, res) => {
	res.send('GET request on /users/' + req.params.userId + '/cars');
});

// POST /{userId}/cars
router.post('/:userId/cars', (req, res) => {
	res.send('POST request on /users/' + req.params.userId + '/cars');
});

// GET /{userId}/cars/{carId}
router.get('/:userId/cars/:carId', (req, res) => {
	res.send('GET request on /users/' + req.params.userId + '/cars/' + req.params.carId);
});

// PUT /{userId}/cars/{carId}
router.put('/:userId/cars/:carId', (req, res) => {
	res.send('PUT request on /users/' + req.params.userId + '/cars/' + req.params.carId);
});

// DELETE /{userId}/cars/{carId}
router.delete('/:userId/cars/:carId', (req, res) => {
	res.send('DELETE request on /users/' + req.params.userId + '/cars/' + req.params.carId);
});

// GET /{userId}/transactions
router.get('/:userId/transactions', (req, res) => {
	res.send('GET request on /users/' + req.params.userId + '/transactions');
});

// POST /{userId}/transactions
router.post('/:userId/transactions', (req, res) => {
	res.send('POST request on /users/' + req.params.userId + '/transactions');
});

module.exports = router;
