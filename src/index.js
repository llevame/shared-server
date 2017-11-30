const express = require('express');
const path = require('path');

var bodyParser = require('body-parser');
var cors = require('cors');
var log4js = require('log4js');

log4js.configure(path.join(__dirname, './config/log4js.json'));

var log = log4js.getLogger('consola');

// Log folder
try {
	require('fs').mkdirSync('./log');
} catch (e) {
	if (e.code != 'EEXIST') {
		console.error('No se puede crear el directorio para logs: ', e);
		process.exit(1);
	}
}

var app = express();

// set body parser limits and type for application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.json({ type: 'application/json' }));

// Sets the port for the app to listen for
app.set('port', process.env.PORT || 5000);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// *** routes *** //
var routes = require('./routes/index.js');

// *** main routes *** //
app.use('/', routes);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(app.get('port'));

if (
	process.env.NODE_ENV !== 'test' &&
	process.env.NODE_ENV !== 'test_rules' &&
	process.env.NODE_ENV !== 'test_transactions'
) {
	log.info('App listening on port %s: ', app.get('port'));
}

module.exports = app;
