process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');
var helperToken = require('../libs/service');

chai.use(chaiHttp);
describe('/token tests', () => {
	
	it('POST action with complete parameters', () => {
		let u = {
			username: "user1",
			password: "password"
		};
		var tokenGenerado= helperToken.createToken(u.username);
		chai.request(server)
			.post('/api/token')
			.set('authorization', 'test ' + tokenGenerado)
			.send(u)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.should.have.property('metadata');
				res.body.should.have.property('token');
				res.body.token.should.have.property('expirexAt');
				res.body.token.should.have.property('token');
			});
	});
	it('POST action without header', () => {
		let u = {
			username: "user1",
			password: "password"
		};
		chai.request(server)
			.post('/api/token')
			.send(u)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.should.have.property('metadata');
				res.body.should.have.property('token');
				res.body.token.should.have.property('expirexAt');
				res.body.token.should.have.property('token');
			});
	});

	it('POST action with incomplete parameter user', () => {
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
				res.body.should.have.property('code').eql(401);
			});
	});

	it('POST action with incomplete parameter password', () => {
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
			});
	});

});
