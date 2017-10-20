process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');
var url = '/api/users';

chai.use(chaiHttp);

describe('users tests', () => {

	describe('/users', () => {

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
				.get(url)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('users');
					res.body.users.should.be.a('array');
					res.body.users.length.should.be.eql(res.body.metadata.count);
					res.body.users[0].should.have.property('id').eql(1);
					res.body.users[0].should.have.property('_ref');
					res.body.users[0].should.have.property('applicationOwner');
					res.body.users[0].should.have.property('type').eql('passenger');
					res.body.users[0].should.have.property('username').eql('juan123');
					res.body.users[0].should.have.property('name').eql('Juan');
					res.body.users[0].should.have.property('surname').eql('Lopez');
					res.body.users[0].should.have.property('country').eql('Argentina');
					res.body.users[0].should.have.property('email').eql('juan@gmail.com');
					res.body.users[0].should.have.property('birthdate').eql('13/1/1990');
					res.body.users[0].should.have.property('images');
					res.body.users[0].should.have.property('balance');
					res.body.users[0].should.have.property('cars');
					res.body.users[0].cars.should.be.a('array');
					done();
				});
		});

		it('POST action', (done) => {
			let user = {
				type: "passenger",
				username: "user123",
				password: "45678",
				fb: {
					userId: "2",
					authToken: "ffegg5443r"
				},
				firstName: "user",
				lastName: "userlastname",
				country: "Argentina",
				email: "user@gmail.com",
				birthdate: "23/2/1999",
				images: ["i1", "i2"]
			};
			chai.request(server)
				.post(url)
				.send(user)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql("passenger");
					res.body.user.should.have.property('username').eql("user123");
					res.body.user.should.have.property('name').eql("user");
					res.body.user.should.have.property('surname').eql("userlastname");
					res.body.user.should.have.property('country').eql("Argentina");
					res.body.user.should.have.property('email').eql("user@gmail.com");
					res.body.user.should.have.property('birthdate').eql("23/2/1999");
					res.body.user.should.have.property('images').eql(["i1", "i2"]);
					res.body.user.should.have.property('balance');
					done();
				});
		});

		it('POST action with no type parameter', (done) => {
			let user = {
				type: "",
				username: "user123",
				password: "45678",
				fb: {
					userId: "2",
					authToken: "ffegg5443r"
				},
				firstName: "user",
				lastName: "userlastname",
				country: "Argentina",
				email: "user@gmail.com",
				birthdate: "23/2/1999",
				images: ["i1", "i2"]
			};
			chai.request(server)
				.post(url)
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});

		it('POST action with password but no fb field', (done) => {
			let user = {
				type: "passenger",
				username: "user123",
				password: "45678",
				firstName: "user",
				lastName: "userlastname",
				country: "Argentina",
				email: "user@gmail.com",
				birthdate: "23/2/1999",
				images: ["i1", "i2"]
			};
			chai.request(server)
				.post(url)
				.send(user)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql(user.type);
					res.body.user.should.have.property('username').eql(user.username);
					res.body.user.should.have.property('name').eql(user.firstName);
					res.body.user.should.have.property('surname').eql(user.lastName);
					res.body.user.should.have.property('country').eql(user.country);
					res.body.user.should.have.property('email').eql(user.email);
					res.body.user.should.have.property('birthdate').eql(user.birthdate);
					res.body.user.should.have.property('images').eql(user.images);
					res.body.user.should.have.property('balance');
					done();
				});
		});
	});

	describe('/users/validate', () => {
		
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

		it('POST action', (done) => {
			let credentials = {
				username: "juan123",
				password: "1234",
				facebookAuthToken: "mkmcemke4322"
			};
			chai.request(server)
				.post(url + '/validate')
				.send(credentials)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql("passenger");
					res.body.user.should.have.property('username').eql("juan123");
					res.body.user.should.have.property('name').eql("Juan");
					res.body.user.should.have.property('surname').eql("Lopez");
					res.body.user.should.have.property('country').eql("Argentina");
					res.body.user.should.have.property('email').eql("juan@gmail.com");
					res.body.user.should.have.property('birthdate').eql("13/1/1990");
					res.body.user.should.have.property('images');
					res.body.user.should.have.property('balance');
					done(err);
				});
		});

		it('POST action on user with no fb token but with password', (done) => {
			let credentials = {
				username: "edu123",
				password: "1234fdf"
			};
			chai.request(server)
				.post(url + '/validate')
				.send(credentials)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql("passenger");
					res.body.user.should.have.property('username').eql("edu123");
					res.body.user.should.have.property('name').eql("Eduardo");
					res.body.user.should.have.property('surname').eql("Garcia");
					res.body.user.should.have.property('country').eql("Argentina");
					res.body.user.should.have.property('email').eql("edu@gmail.com");
					res.body.user.should.have.property('birthdate').eql("13/1/1990");
					res.body.user.should.have.property('images');
					res.body.user.should.have.property('balance');
					done(err);
				});
		});
	});

	describe('/users/{userId}', () => {
		
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
				.get(url + '/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql("passenger");
					res.body.user.should.have.property('username').eql("juan123");
					res.body.user.should.have.property('name').eql("Juan");
					res.body.user.should.have.property('surname').eql("Lopez");
					res.body.user.should.have.property('country').eql("Argentina");
					res.body.user.should.have.property('email').eql("juan@gmail.com");
					res.body.user.should.have.property('birthdate').eql("13/1/1990");
					res.body.user.should.have.property('images').eql(["i1", "i2"]);
					res.body.user.should.have.property('balance');
					done();
				});
		});

		it('GET action on no resource', (done) => {
			chai.request(server)
				.get(url + '/6')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});

		it('DELETE action', (done) => {
			chai.request(server)
				.delete(url + '/1')
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', (done) => {
			chai.request(server)
				.delete(url + '/6')
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});
	});

	describe('/users/{userId}/trips', () => {
		
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
				.get(url + '/1/trips')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('trips');
					res.body.trips.should.be.a('array');
					done();
				});
		});
	});

	describe('/users/{userId}/cars', () => {
		
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
				.get(url + '/1/cars')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('cars');
					res.body.cars.should.be.a('array');
					res.body.cars[0].should.have.property('id');
					res.body.cars[0].should.have.property('_ref');
					res.body.cars[0].should.have.property('owner').eql("1");
					res.body.cars[0].should.have.property('properties');
					res.body.cars[0].properties.should.be.a('array');
					res.body.cars[0].properties[0].should.have.property('name');
					res.body.cars[0].properties[0].should.have.property('value');
					done();
				});
		});

		it('POST action', (done) => {
			let car = {
				properties: [
					{
						name: "color",
						value: "rojo"
					}
				]
			};
			chai.request(server)
				.post(url + '/1/cars')
				.send(car)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('car');
					res.body.car.should.have.property('id');
					res.body.car.should.have.property('_ref');
					res.body.car.should.have.property('owner').eql("1");
					res.body.car.should.have.property('properties').eql([{name: "color", value: "rojo"}]);
					done();
				});
		});
	});

	describe('/users/{userId}/cars/{carId}', () => {
		
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
				.get(url + '/1/cars/1')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('car');
					res.body.car.should.have.property('id').eql(1);
					res.body.car.should.have.property('_ref');
					res.body.car.should.have.property('owner').eql("1");
					res.body.car.should.have.property('properties').eql([{name: "color", value: "verde"}]);
					done();
				});
		});

		it('DELETE action', (done) => {
			chai.request(server)
				.delete(url + '/1/cars/1')
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});

	describe('/users/{userId}/transactions', () => {
		
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
				.get(url + '/1/transactions')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('transactions');
					res.body.transactions.should.be.a('array');
					done();
				});
		});

		it('POST action', (done) => {
			chai.request(server)
				.post(url + '/1/transactions')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('metadata');
					res.body.should.have.property('transaction');
					res.body.transaction.should.have.property('id');
					res.body.transaction.should.have.property('trip');
					res.body.transaction.should.have.property('timestamp');
					res.body.transaction.should.have.property('cost');
					res.body.transaction.should.have.property('description');
					res.body.transaction.should.have.property('data');
					done();
				});
		});
	});
});
