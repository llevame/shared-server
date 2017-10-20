process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

describe('servers tests', () => {

	describe('/servers', () => {

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

		it('POST action with good parameters', (done) => {
			let s = {
				createdBy: "admin",
				createdTime: 1,
				name: "app_server4"
			};
			chai.request(server)
				.post('/api/servers')
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
					res.body.server.server.should.have.property('createdBy').eql(s.createdBy);
					res.body.server.server.should.have.property('createdTime').eql(s.createdTime);
					res.body.server.server.should.have.property('name').eql(s.name);
					res.body.server.server.should.have.property('lastConnection');
					res.body.server.should.have.property('token');
					res.body.server.token.should.have.property('expiresAt');
					res.body.server.token.should.have.property('token');
					done();
				});
		});

		it('POST action with no parameter createdBy', (done) => {
			let s = {
				id: "0",
				_ref: "0",
				createdBy: "",
				createdTime: 1,
				name: "app_server4",
				lastConnection: "0"
			};
			chai.request(server)
				.post('/api/servers')
				.send(s)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter createdTime', (done) => {
			let s = {
				id: "0",
				_ref: "0",
				createdBy: "admin",
				createdTime: 0,
				name: "app_server4",
				lastConnection: "0"
			};
			chai.request(server)
				.post('/api/servers')
				.send(s)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no parameter name', (done) => {
			let s = {
				id: "0",
				_ref: "0",
				createdBy: "admin",
				createdTime: 1,
				name: "",
				lastConnection: "0"
			};
			chai.request(server)
				.post('/api/servers')
				.send(s)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('GET action', (done) => {
			chai.request(server)
				.get('/api/servers')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('servers');
					res.body.servers.should.be.a('array');
					res.body.servers.length.should.be.eql(res.body.metadata.count);
					res.body.servers[0].should.have.property('id').eql(1);
					res.body.servers[0].should.have.property('_ref');
					res.body.servers[0].should.have.property('createdBy').eql('admin1');
					res.body.servers[0].should.have.property('createdTime').eql(1);
					res.body.servers[0].should.have.property('name').eql('app_server0');
					res.body.servers[0].should.have.property('lastConnection');
					done();
				});
		});

		it('GET action on a single server', (done) => {
			chai.request(server)
				.get('/api/servers/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('server');
					res.body.server.should.have.property('id').eql(1);
					res.body.server.should.have.property('_ref');
					res.body.server.should.have.property('createdBy').eql('admin1');
					res.body.server.should.have.property('createdTime').eql(1);
					res.body.server.should.have.property('name').eql('app_server0');
					res.body.server.should.have.property('lastConnection');
					done();
				});
		});

		it('GET action on no resource', (done) => {
			chai.request(server)
				.get('/api/servers/6')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});

		it('DELETE action on an existing resource', (done) => {
			chai.request(server)
				.delete('/api/servers/1')
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', (done) => {
			chai.request(server)
				.delete('/api/servers/6')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});

		it('PUT action with good parameters', (done) => {
			chai.request(server)
				.get('/api/servers/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('server');
					res.body.server.should.have.property('id').eql(1);
					res.body.server.should.have.property('_ref');
					res.body.server.should.have.property('createdBy').eql('admin1');
					res.body.server.should.have.property('createdTime').eql(1);
					res.body.server.should.have.property('name').eql('app_server0');
					res.body.server.should.have.property('lastConnection');
					chai.request(server)
						.put('/api/servers/1')
						.send({
							_ref: res.body.server._ref,
							name: "app_server0_modificado"
						})
						.end((e, r) => {
							r.should.have.status(200);
							r.body.should.be.a('object');
							r.body.should.have.property('metadata');
							r.body.metadata.should.have.property('version');
							r.body.should.have.property('server');
							r.body.server.should.have.property('id').eql(1);
							r.body.server.should.have.property('_ref');
							r.body.server.should.have.property('createdBy').eql('admin1');
							r.body.server.should.have.property('createdTime').eql(1);
							r.body.server.should.have.property('name').eql('app_server0_modificado');
							r.body.server.should.have.property('lastConnection');
							done();
						});
				});
		});

		it('PUT action with no parameter _ref', (done) => {
			chai.request(server)
				.put('/api/servers/1')
				.send({
					name: "app_server0_modificado"
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no parameter name', (done) => {
			chai.request(server)
				.put('/api/servers/1')
				.send({
					_ref: "c3r2f43ff3f34f43f3"
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with bad _ref parameter', (done) => {
			chai.request(server)
				.put('/api/servers/1')
				.send({
					_ref: "scv43t34f43f43f432",
					name: "app_server0_modificado"
				})
				.end((err, res) => {
					res.should.have.status(409);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('Conflicto en el update');
					done();
				});
		});

		it('POST action reseting a server´s token', (done) => {
			chai.request(server)
				.post('/api/servers/1')
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
					res.body.server.server.should.have.property('lastConnection');
					res.body.server.should.have.property('token');
					res.body.server.token.should.have.property('expiresAt');
					res.body.server.token.should.have.property('token');
					done();
				});
		});
	});
});
