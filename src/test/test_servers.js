process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');

chai.use(chaiHttp);

describe('/servers/ping tests', () => {

	it('POST action', () => {
		chai.request(server)
			.post('/api/servers/ping')
			.end((err, res) => {
				res.body.should.be.eql('POST request on /severs/ping');
			});
	});
});
