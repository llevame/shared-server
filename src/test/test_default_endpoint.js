process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');

chai.use(chaiHttp);

describe('Default endpoint /api test', () => {
	it('GET action', () => {
		chai.request(server)
			.get('/api')
			.end((err, res) => {
				res.body.should.be.eql('Default endpoint on /api');
			});
	});
});
