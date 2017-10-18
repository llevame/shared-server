process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

describe('/servers tests', () => {

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
			id: "0",
			_ref: "0",
			createdBy: "admin",
			createdTime: 1,
			name: "appserver0",
			lastConnection: "0"
		};
		chai.request(server)
			.post('/api/servers')
			.send(s)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.server.server.should.have.property('id');
				res.body.server.server.should.have.property('_ref');
				res.body.server.server.should.have.property('createdBy').eql(s.createdBy);
				res.body.server.server.should.have.property('createdTime').eql(s.createdTime);
				res.body.server.server.should.have.property('name').eql(s.name);
				res.body.server.server.should.have.property('lastConnection');
				done();
			});
	});

	it('POST action with no parameter createdBy', () => {
		let s = {
			id: "0",
			_ref: "0",
			createdBy: "",
			createdTime: 1,
			name: "appserver0",
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
			});
	});

	it('POST action with no parameter createdTime', () => {
		let s = {
			id: "0",
			_ref: "0",
			createdBy: "admin",
			createdTime: 0,
			name: "appserver0",
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
			});
	});

	it('POST action with no parameter name', () => {
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
				res.body.servers.should.be.a('array');
				res.body.servers.length.should.be.eql(res.body.metadata.count);
				done();
			});
	});
});
