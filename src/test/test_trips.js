process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');

chai.use(chaiHttp);

var tokenGenerator = require('../libs/service');
var token = tokenGenerator.createAppToken({id: 1});
var suffix = '?token=' + token;

describe('trips tests', () => {

	describe('/trips', () => {
		
		it('POST action', (done) => {
			chai.request(server)
				.post('/api/trips' + suffix)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					done();
				});
		});
	});

	describe('/trips/estimate', () => {
		
		it('POST action', (done) => {
			chai.request(server)
				.post('/api/trips/estimate' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/trips/estimate');
					done();
				});
		});
	});

	describe('/trips/{tripId}', () => {
		
		it('GET action', (done) => {
			chai.request(server)
				.post('/api/trips/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/trips/1');
					done();
				});
		});
	});
});



