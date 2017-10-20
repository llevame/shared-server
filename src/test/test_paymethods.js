process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');

chai.use(chaiHttp);

describe('paymethods tests', () => {

	describe('/paymethods', () => {
	
		it('GET action', (done) => {
			chai.request(server)
				.get('/api/paymethods')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/paymethods');
					done();
				});
		});
	});
});


