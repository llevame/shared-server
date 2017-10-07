const express = require('express');
const app = express();

var basePath = '/api';

// default endpoint
var defapi = require('./default');
app.use(basePath, defapi);

// /users endpoint
var users = require('./users');
app.use(basePath + '/users', users);

// /paymethods endpoint
var paymethods = require('./paymethods');
app.use(basePath + '/paymethods', paymethods);

// /trips endpoint
var trips = require('./trips');
app.use(basePath + '/trips', trips);

// /servers endpoint
var servers = require('./servers');
app.use(basePath + '/servers', servers);

// /token endpoint
var token = require('./token');
app.use(basePath + '/token', token);

// /business-users endpoint
var business_users = require('./business_users');
app.use(basePath + '/business-users', business_users);

module.exports = app;
