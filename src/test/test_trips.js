process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');

chai.use(chaiHttp);

describe('trips tests', () => {

	describe('/trips', () => {
		
		it('POST action', (done) => {
			chai.request(server)
				.post('/api/trips')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/trips');
					done();
				});
		});
	});

	describe('/trips/estimate', () => {
		
		it('POST action', (done) => {
			chai.request(server)
				.post('/api/trips/estimate')
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
				.post('/api/trips/1')
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



