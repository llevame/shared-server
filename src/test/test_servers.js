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

// valid business-user token
var token = tokenGenerator.createBusinessToken({ id: 1, roles: ['admin'] });
var suffix = '?token=' + token;

// expired app-server token
var payload = {
	id: 1,
	iat: moment().unix(),
	exp: moment()
		.subtract(1, 'day')
		.unix(),
};

var tokenExpired = jwt.sign(payload, proc.APP_TOKEN_SECRET_KEY);
var expiredSuffix = '?token=' + tokenExpired;

describe('servers tests', () => {
	describe('/servers', () => {
		beforeEach(function(done) {
			this.timeout(4000);
			knex.migrate
				.rollback()
				.then(() => knex.migrate.latest())
				.then(() => knex.seed.run())
				.then(() => done());
		});

		afterEach(done => {
			knex.migrate.rollback().then(() => done());
		});

		it('POST action with good parameters', done => {
			let s = {
				createdBy: 'admin',
				createdTime: 1,
				name: 'app_server4',
			};
			chai
				.request(server)
				.post('/api/servers' + suffix)
				.send(s)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('server');
					res.body.server.should.have.property('server');
					res.body.server.server.should.have.property('id');
					res.body.server.server.should.have.property('_ref');
					res.body.server.server.should.have
						.property('createdBy')
						.eql(s.createdBy);
					res.body.server.server.should.have
						.property('createdTime')
						.eql(s.createdTime);
					res.body.server.server.should.have
						.property('name')
						.eql(s.name);
					res.body.server.server.should.have.property(
						'lastConnection'
					);
					res.body.server.should.have.property('token');
					res.body.server.token.should.have.property('expiresAt');
					res.body.server.token.should.have.property('token');
					done();
				});
		});

		it('POST action with no parameter createdBy', done => {
			let s = {
				id: '0',
				_ref: '0',
				createdBy: '',
				createdTime: 1,
				name: 'app_server4',
				lastConnection: '0',
			};
			chai
				.request(server)
				.post('/api/servers' + suffix)
				.send(s)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter createdTime', done => {
			let s = {
				id: '0',
				_ref: '0',
				createdBy: 'admin',
				createdTime: 0,
				name: 'app_server4',
				lastConnection: '0',
			};
			chai
				.request(server)
				.post('/api/servers' + suffix)
				.send(s)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter name', done => {
			let s = {
				id: '0',
				_ref: '0',
				createdBy: 'admin',
				createdTime: 1,
				name: '',
				lastConnection: '0',
			};
			chai
				.request(server)
				.post('/api/servers' + suffix)
				.send(s)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('GET action', done => {
			chai
				.request(server)
				.get('/api/servers' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('servers');
					res.body.servers.should.be.a('array');
					res.body.servers.length.should.be.eql(
						res.body.metadata.count
					);
					res.body.servers[0].should.have.property('id').eql(1);
					res.body.servers[0].should.have.property('_ref');
					res.body.servers[0].should.have
						.property('createdBy')
						.eql('admin1');
					res.body.servers[0].should.have.property('createdTime');
					res.body.servers[0].should.have
						.property('name')
						.eql('app_server0');
					res.body.servers[0].should.have.property('lastConnection');
					done();
				});
		});

		it('GET action on a single server', done => {
			chai
				.request(server)
				.get('/api/servers/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('server');
					res.body.server.should.have.property('id').eql(1);
					res.body.server.should.have.property('_ref');
					res.body.server.should.have
						.property('createdBy')
						.eql('admin1');
					res.body.server.should.have.property('createdTime');
					res.body.server.should.have
						.property('name')
						.eql('app_server0');
					res.body.server.should.have.property('lastConnection');
					done();
				});
		});

		it('GET action on no resource', done => {
			chai
				.request(server)
				.get('/api/servers/6' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('No existe el recurso solicitado');
					done();
				});
		});

		it('DELETE action on an existing resource', done => {
			chai
				.request(server)
				.delete('/api/servers/1' + suffix)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', done => {
			chai
				.request(server)
				.delete('/api/servers/6' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('No existe el recurso solicitado');
					done();
				});
		});

		it('PUT action with good parameters', done => {
			chai
				.request(server)
				.get('/api/servers/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('server');
					res.body.server.should.have.property('id').eql(1);
					res.body.server.should.have.property('_ref');
					res.body.server.should.have
						.property('createdBy')
						.eql('admin1');
					res.body.server.should.have.property('createdTime');
					res.body.server.should.have
						.property('name')
						.eql('app_server0');
					res.body.server.should.have.property('lastConnection');
					chai
						.request(server)
						.put('/api/servers/1' + suffix)
						.send({
							_ref: res.body.server._ref,
							name: 'app_server0_modificado',
						})
						.end((e, r) => {
							r.should.have.status(200);
							r.body.should.be.a('object');
							r.body.should.have.property('metadata');
							r.body.metadata.should.have.property('version');
							r.body.should.have.property('server');
							r.body.server.should.have.property('id').eql(1);
							r.body.server.should.have.property('_ref');
							r.body.server.should.have
								.property('createdBy')
								.eql('admin1');
							r.body.server.should.have.property('createdTime');
							r.body.server.should.have
								.property('name')
								.eql('app_server0_modificado');
							r.body.server.should.have.property(
								'lastConnection'
							);
							done();
						});
				});
		});

		it('PUT action with no parameter _ref', done => {
			chai
				.request(server)
				.put('/api/servers/1' + suffix)
				.send({
					name: 'app_server0_modificado',
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
				.put('/api/servers/1' + suffix)
				.send({
					_ref: 'c3r2f43ff3f34f43f3',
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
				.put('/api/servers/1' + suffix)
				.send({
					_ref: 'scv43t34f43f43f432',
					name: 'app_server0_modificado',
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

		it('POST action reseting a server´s token', done => {
			chai
				.request(server)
				.post('/api/servers/1' + suffix)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('server');
					res.body.server.should.have.property('server');
					res.body.server.server.should.have.property('id');
					res.body.server.server.should.have.property('_ref');
					res.body.server.server.should.have.property('createdBy');
					res.body.server.server.should.have.property('createdTime');
					res.body.server.server.should.have.property('name');
					res.body.server.server.should.have.property(
						'lastConnection'
					);
					res.body.server.should.have.property('token');
					res.body.server.token.should.have.property('expiresAt');
					res.body.server.token.should.have.property('token');
					done();
				});
		});
	});

	describe('/servers/ping', () => {
		beforeEach(function(done) {
			this.timeout(4000);
			knex.migrate
				.rollback()
				.then(() => knex.migrate.latest())
				.then(() => knex.seed.run())
				.then(() => done());
		});

		afterEach(done => {
			knex.migrate.rollback().then(() => done());
		});

		it('POST action - expired token and resets it', done => {
			chai
				.request(server)
				.post('/api/servers/ping' + expiredSuffix)
				.end((e, r) => {
					r.should.have.status(201);
					r.body.should.be.a('object');
					r.body.should.have.property('metadata');
					r.body.metadata.should.have.property('version');
					r.body.should.have.property('ping');
					r.body.ping.should.have.property('server');
					r.body.ping.server.should.have.property('id');
					r.body.ping.server.should.have.property('_ref');
					r.body.ping.server.should.have.property('createdBy');
					r.body.ping.server.should.have.property('createdTime');
					r.body.ping.server.should.have.property('name');
					r.body.ping.server.should.have.property('lastConnection');
					r.body.ping.should.have.property('token');
					r.body.ping.token.should.have.property('expiresAt');
					r.body.ping.token.should.have.property('token');
					done();
				});
		});

		it('POST action', done => {
			let s = {
				createdBy: 'admin',
				createdTime: 1,
				name: 'app_server4',
			};
			chai
				.request(server)
				.post('/api/servers' + suffix)
				.send(s)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('server');
					res.body.server.should.have.property('server');
					res.body.server.server.should.have.property('id');
					res.body.server.server.should.have.property('_ref');
					res.body.server.server.should.have
						.property('createdBy')
						.eql(s.createdBy);
					res.body.server.server.should.have
						.property('createdTime')
						.eql(s.createdTime);
					res.body.server.server.should.have
						.property('name')
						.eql(s.name);
					res.body.server.server.should.have.property(
						'lastConnection'
					);
					res.body.server.should.have.property('token');
					res.body.server.token.should.have.property('expiresAt');
					res.body.server.token.should.have.property('token');
					chai
						.request(server)
						.post(
							'/api/servers/ping?token=' +
								res.body.server.token.token
						)
						.end((e, r) => {
							r.should.have.status(201);
							r.body.should.be.a('object');
							r.body.should.have.property('metadata');
							r.body.metadata.should.have.property('version');
							r.body.should.have.property('ping');
							r.body.ping.should.have.property('server');
							r.body.ping.server.should.have.property('id');
							r.body.ping.server.should.have.property('_ref');
							r.body.ping.server.should.have
								.property('createdBy')
								.eql(s.createdBy);
							r.body.ping.server.should.have
								.property('createdTime')
								.eql(s.createdTime);
							r.body.ping.server.should.have
								.property('name')
								.eql(s.name);
							r.body.ping.server.should.have.property(
								'lastConnection'
							);
							r.body.ping.should.have.property('token');
							r.body.ping.token.should.have.property('expiresAt');
							r.body.ping.token.should.have.property('token');
							done();
						});
				});
		});

		it('POST action with no token passed', done => {
			chai
				.request(server)
				.post('/api/servers/ping')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Acceso no autorizado');
					done();
				});
		});

		it('POST action with bad token passed', done => {
			chai
				.request(server)
				.post('/api/servers/ping?token=c4ff43fddewf43f4fdwfd32')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});
	});
});
