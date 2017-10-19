process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

describe('business-users tests', () => {

	describe('/business-users', () => {

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

		it('GET action', (done) => {
			chai.request(server)
				.get('/api/business-users')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.be.a('array');
					res.body.businessUser.length.should.be.eql(res.body.metadata.count);
					res.body.businessUser[0].should.have.property('id').eql(1);
					res.body.businessUser[0].should.have.property('_ref');
					res.body.businessUser[0].should.have.property('username').eql('juan123');
					res.body.businessUser[0].should.have.property('password').eql('123');
					res.body.businessUser[0].should.have.property('name').eql('juan');
					res.body.businessUser[0].should.have.property('surname').eql('lopez');
					res.body.businessUser[0].should.have.property('roles').eql(["admin"]);
					res.body.businessUser[0].roles.should.be.a('array');
					done();
				});
		});

		it('GET action single business-user', (done) => {
			chai.request(server)
				.get('/api/business-users/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.have.property('id').eql(1);
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have.property('username').eql('juan123');
					res.body.businessUser.should.have.property('password').eql('123');
					res.body.businessUser.should.have.property('name').eql('juan');
					res.body.businessUser.should.have.property('surname').eql('lopez');
					res.body.businessUser.should.have.property('roles').eql(["admin"]);
					res.body.businessUser.roles.should.be.a('array');
					done();
				});
		});

		it('POST action with good parameters', (done) => {
			let bu = {
				username: "admin0",
				password: "1234",
				name: "admin",
				surname: "adminsurname",
				roles: ["admin"]
			};
			chai.request(server)
				.post('/api/business-users')
				.send(bu)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.businessUser.should.have.property('id');
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have.property('username').eql(bu.username);
					res.body.businessUser.should.have.property('password').eql(bu.password);
					res.body.businessUser.should.have.property('name').eql(bu.name);
					res.body.businessUser.should.have.property('surname').eql(bu.surname);
					res.body.businessUser.roles.should.be.a('array');
					res.body.businessUser.should.have.property('roles').eql(bu.roles);
					done();
				});
		});

		it('POST action with no parameter username', (done) => {
			let bu = {
				username: "",
				password: "1234",
				name: "admin",
				surname: "adminsurname",
				roles: ["admin"]
			};
			chai.request(server)
				.post('/api/business-users')
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter password', (done) => {
			let bu = {
				username: "admin0",
				password: "",
				name: "admin",
				surname: "adminsurname",
				roles: ["admin"]
			};
			chai.request(server)
				.post('/api/business-users')
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter name', (done) => {
			let bu = {
				username: "admin0",
				password: "1234",
				name: "",
				surname: "adminsurname",
				roles: ["admin"]
			};
			chai.request(server)
				.post('/api/business-users')
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter surname', (done) => {
			let bu = {
				username: "admin0",
				password: "1234",
				name: "admin",
				surname: "",
				roles: ["admin"]
			};
			chai.request(server)
				.post('/api/business-users')
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter roles', (done) => {
			let bu = {
				username: "admin0",
				password: "1234",
				name: "admin",
				surname: "adminsurname",
				roles: []
			};
			chai.request(server)
				.post('/api/business-users')
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('DELETE action on an existing resource', (done) => {
			chai.request(server)
				.delete('/api/business-users/1')
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', (done) => {
			chai.request(server)
				.delete('/api/business-users/6')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});

		it('PUT action with good parameters', (done) => {
			chai.request(server)
				.get('/api/business-users/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.have.property('id').eql(1);
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have.property('username').eql('juan123');
					res.body.businessUser.should.have.property('password').eql('123');
					res.body.businessUser.should.have.property('name').eql('juan');
					res.body.businessUser.should.have.property('surname').eql('lopez');
					res.body.businessUser.should.have.property('roles').eql(["admin"]);
					res.body.businessUser.roles.should.be.a('array');
					chai.request(server)
						.put('/api/business-users/1')
						.send({
							_ref: res.body.businessUser._ref,
							username: res.body.businessUser.username,
							password: res.body.businessUser.password,
							name: res.body.businessUser.name,
							surname: res.body.businessUser.surname,
							roles: ["user"]
						})
						.end((e, r) => {
							r.should.have.status(200);
							r.body.should.be.a('object');
							r.body.should.have.property('metadata');
							r.body.metadata.should.have.property('version');
							r.body.should.have.property('businessUser');
							r.body.businessUser.should.have.property('id').eql(1);
							r.body.businessUser.should.have.property('_ref');
							r.body.businessUser.should.have.property('username').eql('juan123');
							r.body.businessUser.should.have.property('password').eql('123');
							r.body.businessUser.should.have.property('name').eql('juan');
							r.body.businessUser.should.have.property('surname').eql('lopez');
							r.body.businessUser.should.have.property('roles').eql(["user"]);
							r.body.businessUser.roles.should.be.a('array');
							done();
						});
				});
		});
	});
});
