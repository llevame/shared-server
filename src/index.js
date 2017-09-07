const express = require('express');
const path = require('path');

const app = express();

// Sets the port for the app to listen for
app.set('port', process.env.PORT || 5000);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

var basePath = '/api';

// default endpoint
var defapi = require('./routes/default');
app.use(basePath, defapi);

// /users endpoint
var users = require('./routes/users');
app.use(basePath + '/users', users);

// /paymethods endpoint
var paymethods = require('./routes/paymethods');
app.use(basePath + '/paymethods', paymethods);

// /trips endpoint
var trips = require('./routes/trips');
app.use(basePath + '/trips', trips);

// /servers endpoint
var servers = require('./routes/servers');
app.use(basePath + '/servers', servers);

app.listen(app.get('port'));

if (process.env.NODE_ENV !== 'test') {
	console.log("App listening on port %s: ", app.get('port'));
}

module.exports = app;
