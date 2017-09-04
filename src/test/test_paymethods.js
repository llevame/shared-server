process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');

chai.use(chaiHttp);

describe('/paymethods tests', () => {
	
	it('GET action', () => {
		chai.request(server)
			.get('/api/paymethods')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /paymthods');
			});
	});
});
