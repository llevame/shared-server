process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');

chai.use(chaiHttp);

describe('/business-users tests', () => {
	
	it('GET action', () => {
		chai.request(server)
			.get('/api/business-users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('metadata');
				res.body.metadata.should.have.property('count');
				res.body.businessUser.should.be.a('array');
				res.body.servers.length.should.be.eql(res.body.metadata.count);
			});
	});

	it('POST action with good parameters', () => {
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
			});
	});

	it('POST action with no parameter username', () => {
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
			});
	});

	it('POST action with no parameter password', () => {
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
			});
	});

	it('POST action with no parameter name', () => {
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
			});
	});

	it('POST action with no parameter surname', () => {
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
			});
	});

	it('POST action with no parameter roles', () => {
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
			});
	});
});

describe('/business-users/:userId tests', () => {

	it('PUT action', () => {
		let bu = {
			username: "admin0",
			password: "1234",
			name: "admin",
			surname: "adminsurname",
			roles: ["admin"]
		};
		chai.request(server)
			.put('/api/business-users/1')
			.send(bu)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.businessUser.should.have.property('id').eql("1");
				res.body.businessUser.should.have.property('_ref');
				res.body.businessUser.should.have.property('username').eql(bu.username);
				res.body.businessUser.should.have.property('password').eql(bu.password);
				res.body.businessUser.should.have.property('name').eql(bu.name);
				res.body.businessUser.should.have.property('surname').eql(bu.surname);
				res.body.businessUser.roles.should.be.a('array');
				res.body.businessUser.should.have.property('roles').eql(bu.roles);
			});
	});

	it('DELETE action', () => {
		chai.request(server)
			.delete('/api/business-users/1')
			.end((err, res) => {
				res.should.have.status(204);
			});
	})
});
