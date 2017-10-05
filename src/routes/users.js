// users endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("info");
let user = require('../models/user');
let user_trips = require('../models/user_trips');
let user_transactions = require('../models/user_transactions');
let user_cars = require('../models/user_cars');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', user.getUsers);

// POST /
router.post('/', user.postUser);

// GET /validate
router.get('/validate', user.validateUser);

// DELETE /{userId}
router.delete('/:userId', user.deleteUser);

// GET /{userId}
router.get('/:userId', user.getUser);

// PUT /{userId}
router.put('/:userId', user.updateUser);

// GET /{userId}/trips
router.get('/:userId/trips', user_trips.getTrips);

// GET /{userId}/cars
router.get('/:userId/cars', user_cars.getCars);

// POST /{userId}/cars
router.post('/:userId/cars', user_cars.postCar);

// GET /{userId}/cars/{carId}
router.get('/:userId/cars/:carId', user_cars.getCar);

// PUT /{userId}/cars/{carId}
router.put('/:userId/cars/:carId', user_cars.updateCar);

// DELETE /{userId}/cars/{carId}
router.delete('/:userId/cars/:carId', user_cars.deleteCar);

// GET /{userId}/transactions
router.get('/:userId/transactions', user_transactions.getTransactions);

// POST /{userId}/transactions
router.post('/:userId/transactions', user_transactions.postTransaction);

module.exports = router;
