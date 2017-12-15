// users endpoints

var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger('http');
var user = require('../models/user');
var user_trips = require('../models/user_trips');
var user_transactions = require('../models/user_transactions');
var user_cars = require('../models/user_cars');
var tokenVerifier = require('../middlewares/appTokenVerifier');
var stat = require('../middlewares/statGenerator');

// middleware specific to this router
router.use((req, res, next) => {
	log.info('Request type: %s on URL: %s', req.method, req.originalUrl);
	next();
});

// GET /
router.get('/', tokenVerifier.verifyToken, stat.generateStat, user.getUsers);

// POST /
router.post('/', tokenVerifier.verifyToken, stat.generateStat, user.postUser);

// POST /validate
router.post(
	'/validate',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user.validateUser
);

// DELETE /{userId}
router.delete(
	'/:userId',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user.deleteUser
);

// GET /{userId}
router.get(
	'/:userId',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user.getUser
);

// PUT /{userId}
router.put(
	'/:userId',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user.updateUser
);

// GET /{userId}/trips
router.get(
	'/:userId/trips',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_trips.getTrips
);

// GET /{userId}/cars
router.get(
	'/:userId/cars',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_cars.getCars
);

// POST /{userId}/cars
router.post(
	'/:userId/cars',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_cars.postCar
);

// GET /{userId}/cars/{carId}
router.get(
	'/:userId/cars/:carId',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_cars.getCar
);

// PUT /{userId}/cars/{carId}
router.put(
	'/:userId/cars/:carId',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_cars.updateCar
);

// DELETE /{userId}/cars/{carId}
router.delete(
	'/:userId/cars/:carId',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_cars.deleteCar
);

// GET /{userId}/transactions
router.get(
	'/:userId/transactions',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_transactions.getTransactions
);

// POST /{userId}/transactions
router.post(
	'/:userId/transactions',
	tokenVerifier.verifyToken,
	stat.generateStat,
	user_transactions.postTransaction
);

module.exports = router;
