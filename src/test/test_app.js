var assert = require('chai').expect;
var request = require('request');

describe('Content of main pages', function() {

	it('/api page content', function() {

		request('http://localhost:5000' + '/api', (error, response, body) => {
			expect(body).to.equal('Hello World!');
		});
	});

	it('Main page content', function() {

		request('http://localhost:5000' + '/', (error, response, body) => {
			expect(body).to.equal('GET request to the homepage');
		});
	});
})


