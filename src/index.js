const express = require('express');
const path = require('path');

const app = express();

// Sets the port for the app to listen for
app.set('port', process.env.PORT || 5000);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.get('/api', (req, res) => {
	console.log('GET at /api');
	res.send('Hello World!')
});

// GET method route
app.get('/', (req, res) => {
	res.send('GET request to the homepage')
});

// POST method route
app.post('/', (req, res) => {
	res.send('POST request to the homepage')
});

// The 'catchall' handler: for any request that doesn´t match
// one above, send back React´s index.html file
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

app.listen(app.get('port'), () => {
	console.log("App listening on port %s: ", app.get('port'));
});

