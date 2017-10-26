process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

describe('token tests', () => {

	describe('/token', () => {

		beforeEach(done => {
			knex.migrate.rollback()
			.then(() => knex.migrate.latest())
			.then(() => knex.seed.run())
			.then(() => done());
		});

		afterEach((done) => {
			knex.migrate.rollback()
			.then(() => done());
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

		it('POST action with bad parameter password', (done) => {
			let u = {
				username: "juan123",
				password: "password"
			};
			chai.request(server)
				.post('/api/token')
				.send(u)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(401);
					res.body.should.have.property('message').eql('Acceso no autorizado');
					done();
				});
		});

		it('POST action with bad parameter username - does not exist', (done) => {
			let u = {
				username: "user",
				password: "password"
			};
			chai.request(server)
				.post('/api/token')
				.send(u)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(401);
					res.body.should.have.property('message').eql('Acceso no autorizado');
					done();
				});
		});

		it('POST action with root credentials - admin users already exist', (done) => {
			let u = {
				username: "root",
				password: "root"
			};
			chai.request(server)
				.post('/api/token')
				.send(u)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(401);
					res.body.should.have.property('message').eql('Acceso no autorizado');
					done();
				});
		});
	});

	describe('/token - without seeded users', () => {

		beforeEach(done => {
			knex.migrate.rollback()
			.then(() => knex.migrate.latest())
			.then(() => done());
		});

		afterEach((done) => {
			knex.migrate.rollback()
			.then(() => done());
		});

		it('POST action with root credentials', (done) => {
			let u = {
				username: "root",
				password: "root"
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
	});
});
