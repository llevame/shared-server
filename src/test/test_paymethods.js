process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');

chai.use(chaiHttp);

var tokenGenerator = require('../libs/service');
var token = tokenGenerator.createAppToken({id: 1});
var suffix = '?token=' + token;

describe('paymethods tests', () => {

	describe('/paymethods', () => {
	
		it('GET action', (done) => {
			chai.request(server)
				.get('/api/paymethods' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('paymethods');
					res.body.paymethods.should.be.a('array');
					res.body.paymethods.length.should.be.eql(res.body.metadata.count);
					res.body.paymethods[0].should.have.property('name');
					res.body.paymethods[0].should.have.property('parameters');
					done();
				});
		});
	});
});


