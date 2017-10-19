process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');

chai.use(chaiHttp);

describe('trips tests', () => {

	describe('/trips', () => {
		
		it('POST action', () => {
			chai.request(server)
				.post('/api/trips')
				.end((err, res) => {
					res.body.should.be.eql('POST request on /trips');
				});
		});
	});

	describe('/trips/estimate', () => {
		
		it('POST action', () => {
			chai.request(server)
				.post('/api/trips/estimate')
				.end((err, res) => {
					res.body.should.be.eql('POST request on /trips/estimate');
				});
		});
	});

	describe('/trips/{tripId}', () => {
		
		it('GET action', () => {
			chai.request(server)
				.post('/api/trips/1')
				.end((err, res) => {
					res.body.should.be.eql('POST request on /trips/1');
				});
		});
	});
});



