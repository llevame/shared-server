process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

var tokenGenerator = require('../libs/service');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var env = require('node-env-file');
var proc = env(__dirname + '/../../process.env');

// business-user with 'admin' role
var token = tokenGenerator.createBusinessToken({ id: 1, roles: ['admin'] });
var suffix = '?token=' + token;

// business-user with 'user' role
var userRoleToken = tokenGenerator.createBusinessToken({
	id: 1,
	roles: ['user'],
});
var userRoleSuffix = '?token=' + userRoleToken;

// error token example
var errorToken = 'error-token';
var errorSufffix = '?token=' + errorToken;

// expired token example
var payload = {
	id: 1,
	roles: ['admin'],
	iat: moment().unix(),
	exp: moment()
		.subtract(1, 'day')
		.unix(),
};
var tokenExpired = jwt.sign(payload, proc.BUSINESS_TOKEN_SECRET_KEY);
var expiredSuffix = '?token=' + tokenExpired;

describe('business-users tests', () => {
	describe('/business-users', () => {
		beforeEach(function(done) {
			this.timeout(6000);
			knex.migrate
				.rollback()
				.then(() => knex.migrate.latest())
				.then(() => knex.seed.run())
				.then(() => done());
		});

		afterEach(done => {
			knex.migrate.rollback().then(() => done());
		});

		it('Action without the token in the query', done => {
			chai
				.request(server)
				.get('/api/business-users')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Acceso no autorizado');
					done();
				});
		});

		it('Action with invalid token', done => {
			chai
				.request(server)
				.get('/api/business-users' + errorSufffix)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});

		it('Action with expired token', done => {
			chai
				.request(server)
				.get('/api/business-users' + expiredSuffix)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});

		it('GET action', done => {
			chai
				.request(server)
				.get('/api/business-users' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.be.a('array');
					res.body.businessUser.length.should.be.eql(
						res.body.metadata.count
					);
					res.body.businessUser[0].should.have.property('id').eql(1);
					res.body.businessUser[0].should.have.property('_ref');
					res.body.businessUser[0].should.have
						.property('username')
						.eql('juan123');
					res.body.businessUser[0].should.have
						.property('password')
						.eql('123');
					res.body.businessUser[0].should.have
						.property('name')
						.eql('juan');
					res.body.businessUser[0].should.have
						.property('surname')
						.eql('lopez');
					res.body.businessUser[0].should.have
						.property('roles')
						.eql(['admin']);
					res.body.businessUser[0].roles.should.be.a('array');
					done();
				});
		});

		it('GET action single business-user', done => {
			chai
				.request(server)
				.get('/api/business-users/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.have.property('id').eql(1);
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have
						.property('username')
						.eql('juan123');
					res.body.businessUser.should.have
						.property('password')
						.eql('123');
					res.body.businessUser.should.have
						.property('name')
						.eql('juan');
					res.body.businessUser.should.have
						.property('surname')
						.eql('lopez');
					res.body.businessUser.should.have
						.property('roles')
						.eql(['admin']);
					res.body.businessUser.roles.should.be.a('array');
					done();
				});
		});

		it('GET action on no resource', done => {
			chai
				.request(server)
				.get('/api/business-users/6' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('No existe el recurso solicitado');
					done();
				});
		});

		it('POST action with good parameters', done => {
			let bu = {
				username: 'admin0',
				password: '1234',
				name: 'admin',
				surname: 'adminsurname',
				roles: ['admin'],
			};
			chai
				.request(server)
				.post('/api/business-users' + suffix)
				.send(bu)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.businessUser.should.have.property('id');
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have
						.property('username')
						.eql(bu.username);
					res.body.businessUser.should.have
						.property('password')
						.eql(bu.password);
					res.body.businessUser.should.have
						.property('name')
						.eql(bu.name);
					res.body.businessUser.should.have
						.property('surname')
						.eql(bu.surname);
					res.body.businessUser.roles.should.be.a('array');
					res.body.businessUser.should.have
						.property('roles')
						.eql(bu.roles);
					done();
				});
		});

		it('POST action with no parameter username', done => {
			let bu = {
				username: '',
				password: '1234',
				name: 'admin',
				surname: 'adminsurname',
				roles: ['admin'],
			};
			chai
				.request(server)
				.post('/api/business-users' + suffix)
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter password', done => {
			let bu = {
				username: 'admin0',
				password: '',
				name: 'admin',
				surname: 'adminsurname',
				roles: ['admin'],
			};
			chai
				.request(server)
				.post('/api/business-users' + suffix)
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter name', done => {
			let bu = {
				username: 'admin0',
				password: '1234',
				name: '',
				surname: 'adminsurname',
				roles: ['admin'],
			};
			chai
				.request(server)
				.post('/api/business-users' + suffix)
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter surname', done => {
			let bu = {
				username: 'admin0',
				password: '1234',
				name: 'admin',
				surname: '',
				roles: ['admin'],
			};
			chai
				.request(server)
				.post('/api/business-users' + suffix)
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter roles', done => {
			let bu = {
				username: 'admin0',
				password: '1234',
				name: 'admin',
				surname: 'adminsurname',
				roles: [],
			};
			chai
				.request(server)
				.post('/api/business-users' + suffix)
				.send(bu)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('DELETE action on an existing resource', done => {
			chai
				.request(server)
				.delete('/api/business-users/1' + suffix)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', done => {
			chai
				.request(server)
				.delete('/api/business-users/6' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('No existe el recurso solicitado');
					done();
				});
		});

		it('DELETE action with unauthorized role', done => {
			chai
				.request(server)
				.delete('/api/business-users/6' + userRoleSuffix)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Acceso no autorizado');
					done();
				});
		});

		it('PUT action with good parameters', done => {
			chai
				.request(server)
				.get('/api/business-users/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.have.property('id').eql(1);
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have
						.property('username')
						.eql('juan123');
					res.body.businessUser.should.have
						.property('password')
						.eql('123');
					res.body.businessUser.should.have
						.property('name')
						.eql('juan');
					res.body.businessUser.should.have
						.property('surname')
						.eql('lopez');
					res.body.businessUser.should.have
						.property('roles')
						.eql(['admin']);
					res.body.businessUser.roles.should.be.a('array');
					chai
						.request(server)
						.put('/api/business-users/1' + suffix)
						.send({
							_ref: res.body.businessUser._ref,
							username: res.body.businessUser.username,
							password: res.body.businessUser.password,
							name: res.body.businessUser.name,
							surname: res.body.businessUser.surname,
							roles: ['user'],
						})
						.end((e, r) => {
							r.should.have.status(200);
							r.body.should.be.a('object');
							r.body.should.have.property('metadata');
							r.body.metadata.should.have.property('version');
							r.body.should.have.property('businessUser');
							r.body.businessUser.should.have
								.property('id')
								.eql(1);
							r.body.businessUser.should.have.property('_ref');
							r.body.businessUser.should.have
								.property('username')
								.eql('juan123');
							r.body.businessUser.should.have
								.property('password')
								.eql('123');
							r.body.businessUser.should.have
								.property('name')
								.eql('juan');
							r.body.businessUser.should.have
								.property('surname')
								.eql('lopez');
							r.body.businessUser.should.have
								.property('roles')
								.eql(['user']);
							r.body.businessUser.roles.should.be.a('array');
							done();
						});
				});
		});

		it('PUT action with no parameter username', done => {
			chai
				.request(server)
				.put('/api/business-users/1' + suffix)
				.send({
					_ref: '343242323432432423',
					password: '23133',
					name: 'fddaf',
					surname: 'ada',
					roles: ['user'],
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no parameter password', done => {
			chai
				.request(server)
				.put('/api/business-users/1' + suffix)
				.send({
					_ref: '343242323432432423',
					username: 'admin',
					name: 'fddaf',
					surname: 'ada',
					roles: ['user'],
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no parameter _ref', done => {
			chai
				.request(server)
				.put('/api/business-users/1' + suffix)
				.send({
					username: 'admin',
					name: 'fddaf',
					surname: 'ada',
					roles: ['user'],
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with bad _ref parameter', done => {
			chai
				.request(server)
				.put('/api/business-users/1' + suffix)
				.send({
					_ref: '343242323432432423',
					username: 'juan123',
					password: '123',
					name: 'juan',
					surname: 'lopez',
					roles: ['user'],
				})
				.end((err, res) => {
					res.should.have.status(409);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Conflicto en el update');
					done();
				});
		});

		it('PUT action on no resource', done => {
			chai
				.request(server)
				.put('/api/business-users/6' + suffix)
				.send({
					_ref: '343242323432432423',
					username: 'juan123',
					password: '123',
					name: 'juan',
					surname: 'lopez',
					roles: ['user'],
				})
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('No existe el recurso solicitado');
					done();
				});
		});
	});

	describe('/business-users/me', () => {
		beforeEach(function(done) {
			this.timeout(6000);
			knex.migrate
				.rollback()
				.then(() => knex.migrate.latest())
				.then(() => knex.seed.run())
				.then(() => done());
		});

		afterEach(done => {
			knex.migrate.rollback().then(() => done());
		});

		it('GET action', done => {
			chai
				.request(server)
				.get('/api/business-users/me?token=' + token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.have.property('id').eql(1);
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have
						.property('username')
						.eql('juan123');
					res.body.businessUser.should.have
						.property('password')
						.eql('123');
					res.body.businessUser.should.have
						.property('name')
						.eql('juan');
					res.body.businessUser.should.have
						.property('surname')
						.eql('lopez');
					res.body.businessUser.should.have
						.property('roles')
						.eql(['admin']);
					res.body.businessUser.roles.should.be.a('array');
					done();
				});
		});

		it('PUT action', done => {
			chai
				.request(server)
				.get('/api/business-users/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('businessUser');
					res.body.businessUser.should.have.property('id').eql(1);
					res.body.businessUser.should.have.property('_ref');
					res.body.businessUser.should.have
						.property('username')
						.eql('juan123');
					res.body.businessUser.should.have
						.property('password')
						.eql('123');
					res.body.businessUser.should.have
						.property('name')
						.eql('juan');
					res.body.businessUser.should.have
						.property('surname')
						.eql('lopez');
					res.body.businessUser.should.have
						.property('roles')
						.eql(['admin']);
					res.body.businessUser.roles.should.be.a('array');
					chai
						.request(server)
						.put('/api/business-users/me?token=' + token)
						.send({
							_ref: res.body.businessUser._ref,
							username: res.body.businessUser.username,
							password: res.body.businessUser.password,
							name: 'juan pedro',
							surname: res.body.businessUser.surname,
						})
						.end((e, r) => {
							r.should.have.status(200);
							r.body.should.be.a('object');
							r.body.should.have.property('metadata');
							r.body.metadata.should.have.property('version');
							r.body.should.have.property('businessUser');
							r.body.businessUser.should.have
								.property('id')
								.eql(1);
							r.body.businessUser.should.have.property('_ref');
							r.body.businessUser.should.have
								.property('username')
								.eql('juan123');
							r.body.businessUser.should.have
								.property('password')
								.eql('123');
							r.body.businessUser.should.have
								.property('name')
								.eql('juan pedro');
							r.body.businessUser.should.have
								.property('surname')
								.eql('lopez');
							r.body.businessUser.should.have
								.property('roles')
								.eql(['admin']);
							r.body.businessUser.roles.should.be.a('array');
							done();
						});
				});
		});

		it('PUT action with no parameter username', done => {
			chai
				.request(server)
				.put('/api/business-users/me?token=' + token)
				.send({
					_ref: '343242323432432423',
					password: '23133',
					name: 'fddaf',
					surname: 'ada'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no parameter password', done => {
			chai
				.request(server)
				.put('/api/business-users/me?token=' + token)
				.send({
					_ref: '343242323432432423',
					username: 'admin',
					name: 'fddaf',
					surname: 'ada',
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no parameter name', done => {
			chai
				.request(server)
				.put('/api/business-users/me?token=' + token)
				.send({
					_ref: '343242323432432423',
					username: 'admin',
					password: '4567',
					surname: 'ada',
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no parameter surname', done => {
			chai
				.request(server)
				.put('/api/business-users/me?token=' + token)
				.send({
					_ref: '343242323432432423',
					username: 'admin',
					password: '2345',
					name: 'fddaf'
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});
	});
});
