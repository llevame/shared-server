process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);
describe('/token tests', () => {

	beforeEach(function(done) {
	knex.migrate.rollback()
	.then(function() {
	  knex.migrate.latest()
	  .then(function() {
	    return knex.seed.run()
	    .then(function() {
	      done();
	    });
	  });
	});
	});

	afterEach(function(done) {
		knex.migrate.rollback()
		.then(function() {
			done();
		});
	});

	it('POST action with complete parameters', (done) => {
		let u = {
			username: "juan123",
			password: "123"
		};
		chai.request(server)
			.post('/api/token')
			.send(u)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.should.have.property('metadata');
				res.body.should.have.property('token');
				res.body.token.should.have.property('expiresAt');
				res.body.token.should.have.property('token');
				done();
			});
	});

	it('POST action with incomplete parameter user', (done) => {
		let u = {
			username: "",
			password: "password"
		};
		chai.request(server)
			.post('/api/token')
			.send(u)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('code').eql(400);
				done();
			});
	});

	it('POST action with incomplete parameter password', (done) => {
		let u = {
			username: "user",
			password: ""
		};
		chai.request(server)
			.post('/api/token')
			.send(u)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('object');
				res.body.should.have.property('code').eql(400);
				res.body.should.have.property('message').eql('Parámetros faltantes');
				done();
			});
	});

});
