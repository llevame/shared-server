process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

var tokenGenerator = require('../libs/service');
var token = tokenGenerator.createAppToken({id: 1});
var suffix = '?token=' + token;

describe('trips tests', () => {

	describe('/trips/{tripId}', () => {
		
		beforeEach(function(done) {
			this.timeout(4000);
			knex.migrate.rollback()
			.then(() => knex.migrate.latest())
			.then(() => knex.seed.run())
			.then(() => done());
		});

		afterEach((done) => {
			knex.migrate.rollback()
			.then(() => done());
		});

		it('GET action', (done) => {
			chai.request(server)
				.get('/api/trips/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('trip');
					res.body.trip.should.have.property('id');
					res.body.trip.should.have.property('applicationOwner');
					res.body.trip.should.have.property('driver');
					res.body.trip.should.have.property('passenger');
					res.body.trip.should.have.property('start');
					res.body.trip.start.should.have.property('address');
					res.body.trip.start.should.have.property('timestamp');
					res.body.trip.should.have.property('end');
					res.body.trip.end.should.have.property('address');
					res.body.trip.end.should.have.property('timestamp');
					res.body.trip.should.have.property('totalTime');
					res.body.trip.should.have.property('waitTime');
					res.body.trip.should.have.property('travelTime');
					res.body.trip.should.have.property('distance');
					res.body.trip.should.have.property('route');
					res.body.trip.should.have.property('cost');
					done();
				});
		});

		it('GET action with no token', (done) => {
			chai.request(server)
				.get('/api/trips/1')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(401);
					res.body.should.have.property('message').eql('Acceso no autorizado');
					done();
				});
		});

		it('GET action on non-existing trip', (done) => {
			chai.request(server)
				.get('/api/trips/2' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});
	});
/*
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
*/
});
