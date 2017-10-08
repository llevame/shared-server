const express = require('express');
const path = require('path');

var bodyParser = require('body-parser');
var cors = require('cors'); 
var log4js = require('log4js');

log4js.configure(path.join(__dirname, './config/log4js.json'));

const app = express();

// set body parser limits and type for application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.json({type: 'application/json'}));

// Sets the port for the app to listen for
app.set('port', process.env.PORT || 5000);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Log folder
try {
	require('fs').mkdirSync('./log');
} catch (e) {
	if (e.code != 'EEXIST') {
		console.error("No se puede crear el directorio para logs: ", e);
		process.exit(1);
	}
}

var log = log4js.getLogger("consola");

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

// /token endpoint
var token = require('./routes/token');
app.use(basePath + '/token', token);

// /business-users endpoint
var business_users = require('./routes/business_users');
app.use(basePath + '/business-users', business_users);

app.listen(app.get('port'));

if (process.env.NODE_ENV !== 'test') {
	log.info('App listening on port %s: ', app.get('port'));
}

module.exports = app;
