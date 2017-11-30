process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

var url = '/api/users';

var tokenGenerator = require('../libs/service');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var env = require('node-env-file');
var proc = env(__dirname + '/../../process.env');

// valid app token
var token = tokenGenerator.createAppToken({ id: 1 });
var suffix = '?token=' + token;

// valid business-user token
var businessToken = tokenGenerator.createBusinessToken({
	id: 1,
	roles: ['admin'],
});
var businessSuffix = '?token=' + businessToken;

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

// invalid token
var invalidSuffix = '?token=invalid-token';

describe('users tests', () => {
	describe('token verifications', () => {
		it('no app token', done => {
			chai
				.request(server)
				.get(url)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});

		it('app token expired', done => {
			chai
				.request(server)
				.get(url + expiredSuffix)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});

		it('invalid token', done => {
			chai
				.request(server)
				.get(url + invalidSuffix)
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});
	});

	describe('/users', () => {
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

		it('GET action with business-user token', done => {
			chai
				.request(server)
				.get(url + businessSuffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('users');
					res.body.users.should.be.a('array');
					res.body.users.length.should.be.eql(
						res.body.metadata.count
					);
					res.body.users[0].should.have.property('id').eql(1);
					res.body.users[0].should.have.property('_ref');
					res.body.users[0].should.have.property('applicationOwner');
					res.body.users[0].should.have
						.property('type')
						.eql('passenger');
					res.body.users[0].should.have
						.property('username')
						.eql('juan123');
					res.body.users[0].should.have.property('name').eql('Juan');
					res.body.users[0].should.have
						.property('surname')
						.eql('Lopez');
					res.body.users[0].should.have
						.property('country')
						.eql('Argentina');
					res.body.users[0].should.have
						.property('email')
						.eql('juan@gmail.com');
					res.body.users[0].should.have
						.property('birthdate')
						.eql('13/1/1990');
					res.body.users[0].should.have.property('images');
					res.body.users[0].should.have.property('balance');
					res.body.users[0].should.have.property('cars');
					res.body.users[0].cars.should.be.a('array');
					done();
				});
		});

		it('GET action with app-server token', done => {
			chai
				.request(server)
				.get(url + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count');
					res.body.metadata.should.have.property('total');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('users');
					res.body.users.should.be.a('array');
					res.body.users.length.should.be.eql(
						res.body.metadata.count
					);
					res.body.users[0].should.have.property('id').eql(1);
					res.body.users[0].should.have.property('_ref');
					res.body.users[0].should.have.property('applicationOwner');
					res.body.users[0].should.have
						.property('type')
						.eql('passenger');
					res.body.users[0].should.have
						.property('username')
						.eql('juan123');
					res.body.users[0].should.have.property('name').eql('Juan');
					res.body.users[0].should.have
						.property('surname')
						.eql('Lopez');
					res.body.users[0].should.have
						.property('country')
						.eql('Argentina');
					res.body.users[0].should.have
						.property('email')
						.eql('juan@gmail.com');
					res.body.users[0].should.have
						.property('birthdate')
						.eql('13/1/1990');
					res.body.users[0].should.have.property('images');
					res.body.users[0].should.have.property('balance');
					res.body.users[0].should.have.property('cars');
					res.body.users[0].cars.should.be.a('array');
					done();
				});
		});

		it('POST action', done => {
			let user = {
				type: 'passenger',
				username: 'user123',
				password: '45678',
				fb: {
					userId: '2',
					authToken: 'ffegg5443r',
				},
				firstName: 'user',
				lastName: 'userlastname',
				country: 'Argentina',
				email: 'user@gmail.com',
				birthdate: '23/2/1999',
				images: ['i1', 'i2'],
			};
			chai
				.request(server)
				.post(url + suffix)
				.send(user)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql('passenger');
					res.body.user.should.have
						.property('username')
						.eql('user123');
					res.body.user.should.have.property('name').eql('user');
					res.body.user.should.have
						.property('surname')
						.eql('userlastname');
					res.body.user.should.have
						.property('country')
						.eql('Argentina');
					res.body.user.should.have
						.property('email')
						.eql('user@gmail.com');
					res.body.user.should.have
						.property('birthdate')
						.eql('23/2/1999');
					res.body.user.should.have
						.property('images')
						.eql(['i1', 'i2']);
					res.body.user.should.have.property('balance');
					done();
				});
		});

		it('POST action with no type parameter', done => {
			let user = {
				type: '',
				username: 'user123',
				password: '45678',
				fb: {
					userId: '2',
					authToken: 'ffegg5443r',
				},
				firstName: 'user',
				lastName: 'userlastname',
				country: 'Argentina',
				email: 'user@gmail.com',
				birthdate: '23/2/1999',
				images: ['i1', 'i2'],
			};
			chai
				.request(server)
				.post(url + suffix)
				.send(user)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have.property('message');
					done();
				});
		});

		it('POST action with password but no fb field', done => {
			let user = {
				type: 'passenger',
				username: 'user123',
				password: '45678',
				firstName: 'user',
				lastName: 'userlastname',
				country: 'Argentina',
				email: 'user@gmail.com',
				birthdate: '23/2/1999',
				images: ['i1', 'i2'],
			};
			chai
				.request(server)
				.post(url + suffix)
				.send(user)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql(user.type);
					res.body.user.should.have
						.property('username')
						.eql(user.username);
					res.body.user.should.have
						.property('name')
						.eql(user.firstName);
					res.body.user.should.have
						.property('surname')
						.eql(user.lastName);
					res.body.user.should.have
						.property('country')
						.eql(user.country);
					res.body.user.should.have.property('email').eql(user.email);
					res.body.user.should.have
						.property('birthdate')
						.eql(user.birthdate);
					res.body.user.should.have
						.property('images')
						.eql(user.images);
					res.body.user.should.have.property('balance');
					done();
				});
		});
	});

	describe('/users/validate', () => {
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

		it('POST action', done => {
			let credentials = {
				username: 'juan123',
				password: '1234',
				facebookAuthToken: 'mkmcemke4322',
			};
			chai
				.request(server)
				.post(url + '/validate' + suffix)
				.send(credentials)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql('passenger');
					res.body.user.should.have
						.property('username')
						.eql('juan123');
					res.body.user.should.have.property('name').eql('Juan');
					res.body.user.should.have.property('surname').eql('Lopez');
					res.body.user.should.have
						.property('country')
						.eql('Argentina');
					res.body.user.should.have
						.property('email')
						.eql('juan@gmail.com');
					res.body.user.should.have
						.property('birthdate')
						.eql('13/1/1990');
					res.body.user.should.have.property('images');
					res.body.user.should.have.property('balance');
					done(err);
				});
		});

		it('POST action on user with no fb token but with password', done => {
			let credentials = {
				username: 'edu123',
				password: '1234fdf',
			};
			chai
				.request(server)
				.post(url + '/validate' + suffix)
				.send(credentials)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql('passenger');
					res.body.user.should.have
						.property('username')
						.eql('edu123');
					res.body.user.should.have.property('name').eql('Eduardo');
					res.body.user.should.have.property('surname').eql('Garcia');
					res.body.user.should.have
						.property('country')
						.eql('Argentina');
					res.body.user.should.have
						.property('email')
						.eql('edu@gmail.com');
					res.body.user.should.have
						.property('birthdate')
						.eql('13/1/1990');
					res.body.user.should.have.property('images');
					res.body.user.should.have.property('balance');
					done(err);
				});
		});

		it('POST action on user with bad password', done => {
			let credentials = {
				username: 'edu123',
				password: '123',
			};
			chai
				.request(server)
				.post(url + '/validate' + suffix)
				.send(credentials)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Validación fallida');
					done();
				});
		});

		it('POST action on user with bad fbtoken', done => {
			let credentials = {
				username: 'juan123',
				facebookAuthToken: 'fbtoken',
			};
			chai
				.request(server)
				.post(url + '/validate' + suffix)
				.send(credentials)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Validación fallida');
					done();
				});
		});
	});

	describe('/users/{userId}', () => {
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

		it('GET action', done => {
			chai
				.request(server)
				.get(url + '/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id');
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql('passenger');
					res.body.user.should.have
						.property('username')
						.eql('juan123');
					res.body.user.should.have.property('name').eql('Juan');
					res.body.user.should.have.property('surname').eql('Lopez');
					res.body.user.should.have
						.property('country')
						.eql('Argentina');
					res.body.user.should.have
						.property('email')
						.eql('juan@gmail.com');
					res.body.user.should.have
						.property('birthdate')
						.eql('13/1/1990');
					res.body.user.should.have
						.property('images')
						.eql(['i1', 'i2']);
					res.body.user.should.have.property('balance');
					done();
				});
		});

		it('GET action on no resource', done => {
			chai
				.request(server)
				.get(url + '/6' + suffix)
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

		it('PUT action with good parameters', done => {
			chai
				.request(server)
				.get(url + '/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.user.should.have.property('id').eql(1);
					res.body.user.should.have.property('_ref');
					res.body.user.should.have.property('applicationOwner');
					res.body.user.should.have.property('type').eql('passenger');
					res.body.user.should.have
						.property('username')
						.eql('juan123');
					res.body.user.should.have.property('name').eql('Juan');
					res.body.user.should.have.property('surname').eql('Lopez');
					res.body.user.should.have
						.property('country')
						.eql('Argentina');
					res.body.user.should.have
						.property('email')
						.eql('juan@gmail.com');
					res.body.user.should.have
						.property('birthdate')
						.eql('13/1/1990');
					res.body.user.should.have
						.property('images')
						.eql(['i1', 'i2']);
					res.body.user.should.have.property('balance');
					chai
						.request(server)
						.put(url + '/1' + suffix)
						.send({
							_ref: res.body.user._ref,
							type: res.body.user.type,
							username: res.body.user.username,
							password: res.body.user.password,
							fb: {
								userId: 'juan123',
								authToken: 'facebookAuthToken',
							},
							firstName: 'Juan Pablo',
							lastName: res.body.user.surname,
							country: res.body.user.country,
							email: res.body.user.email,
							birthdate: res.body.user.birthdate,
							images: res.body.user.images,
						})
						.end((e, r) => {
							r.should.have.status(200);
							r.body.should.be.a('object');
							r.body.user.should.have.property('id').eql(1);
							r.body.user.should.have.property('_ref');
							r.body.user.should.have.property(
								'applicationOwner'
							);
							r.body.user.should.have
								.property('type')
								.eql('passenger');
							r.body.user.should.have
								.property('username')
								.eql('juan123');
							r.body.user.should.have
								.property('name')
								.eql('Juan Pablo');
							r.body.user.should.have
								.property('surname')
								.eql('Lopez');
							r.body.user.should.have
								.property('country')
								.eql('Argentina');
							r.body.user.should.have
								.property('email')
								.eql('juan@gmail.com');
							r.body.user.should.have
								.property('birthdate')
								.eql('13/1/1990');
							r.body.user.should.have
								.property('images')
								.eql(['i1', 'i2']);
							r.body.user.should.have.property('balance');
							done();
						});
				});
		});

		it('PUT action with no _ref parameter', done => {
			chai
				.request(server)
				.put(url + '/1' + suffix)
				.send({
					type: 'passenger',
					username: 'user123',
					password: '45678',
					firstName: 'user',
					lastName: 'userlastname',
					country: 'Argentina',
					email: 'user@gmail.com',
					birthdate: '23/2/1999',
					images: ['i1', 'i2'],
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

		it('PUT action with no username parameter', done => {
			chai
				.request(server)
				.put(url + '/1' + suffix)
				.send({
					_ref: 'crf43f3f3fdfweaf32',
					type: 'passenger',
					password: '45678',
					firstName: 'user',
					lastName: 'userlastname',
					country: 'Argentina',
					email: 'user@gmail.com',
					birthdate: '23/2/1999',
					images: ['i1', 'i2'],
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

		it('PUT action with no type parameter', done => {
			chai
				.request(server)
				.put(url + '/1' + suffix)
				.send({
					_ref: 'cf43fwefe43fwe',
					username: 'user123',
					password: '45678',
					firstName: 'user',
					lastName: 'userlastname',
					country: 'Argentina',
					email: 'user@gmail.com',
					birthdate: '23/2/1999',
					images: ['i1', 'i2'],
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

		it('PUT action with on no resource', done => {
			chai
				.request(server)
				.put(url + '/7' + suffix)
				.send({
					_ref: 'cref44fwf34rf',
					type: 'passenger',
					username: 'user123',
					password: '45678',
					firstName: 'user',
					lastName: 'userlastname',
					country: 'Argentina',
					email: 'user@gmail.com',
					birthdate: '23/2/1999',
					images: ['i1', 'i2'],
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

		it('PUT action with bad _ref parameter', done => {
			chai
				.request(server)
				.put(url + '/1' + suffix)
				.send({
					_ref: 'cref44fwf34rf',
					type: 'passenger',
					username: 'user123',
					password: '45678',
					firstName: 'user',
					lastName: 'userlastname',
					country: 'Argentina',
					email: 'user@gmail.com',
					birthdate: '23/2/1999',
					images: ['i1', 'i2'],
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

		it('DELETE action', done => {
			chai
				.request(server)
				.delete(url + '/1' + suffix)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', done => {
			chai
				.request(server)
				.delete(url + '/6' + suffix)
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
	});

	describe('/users/{userId}/trips', () => {
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

		it('GET action', done => {
			chai
				.request(server)
				.get(url + '/1/trips' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('trips');
					res.body.trips.should.be.a('array');
					done();
				});
		});

		it('GET action on no user', done => {
			chai
				.request(server)
				.get(url + '/10/trips' + suffix)
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
	});

	describe('/users/{userId}/cars', () => {
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

		it('GET action', done => {
			chai
				.request(server)
				.get(url + '/1/cars' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('cars');
					res.body.cars.should.be.a('array');
					res.body.cars[0].should.have.property('id');
					res.body.cars[0].should.have.property('_ref');
					res.body.cars[0].should.have.property('owner').eql('1');
					res.body.cars[0].should.have.property('properties');
					res.body.cars[0].properties.should.be.a('array');
					res.body.cars[0].properties[0].should.have.property('name');
					res.body.cars[0].properties[0].should.have.property(
						'value'
					);
					done();
				});
		});

		it('POST action', done => {
			let car = {
				properties: [
					{
						name: 'color',
						value: 'rojo',
					},
				],
			};
			chai
				.request(server)
				.post(url + '/1/cars' + suffix)
				.send(car)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('car');
					res.body.car.should.have.property('id');
					res.body.car.should.have.property('_ref');
					res.body.car.should.have.property('owner').eql('1');
					res.body.car.should.have
						.property('properties')
						.eql([{ name: 'color', value: 'rojo' }]);
					done();
				});
		});

		it('POST action with no properties parameter', done => {
			chai
				.request(server)
				.post(url + '/1/cars' + suffix)
				.send({
					owner: '1',
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

		it('POST action with empty properties parameter', done => {
			chai
				.request(server)
				.post(url + '/1/cars' + suffix)
				.send({
					properties: [],
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

	describe('/users/{userId}/cars/{carId}', () => {
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

		it('GET action', done => {
			chai
				.request(server)
				.get(url + '/1/cars/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('car');
					res.body.car.should.have.property('id').eql(1);
					res.body.car.should.have.property('_ref');
					res.body.car.should.have.property('owner').eql('1');
					res.body.car.should.have
						.property('properties')
						.eql([{ name: 'color', value: 'verde' }]);
					done();
				});
		});

		it('GET action on no car resource', done => {
			chai
				.request(server)
				.get(url + '/1/cars/3' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Auto inexistente');
					done();
				});
		});

		it('DELETE action', done => {
			chai
				.request(server)
				.delete(url + '/1/cars/1' + suffix)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', done => {
			chai
				.request(server)
				.delete(url + '/1/cars/6' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Auto inexistente');
					done();
				});
		});

		it('PUT action', done => {
			chai
				.request(server)
				.get(url + '/1/cars/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('car');
					res.body.car.should.have.property('id').eql(1);
					res.body.car.should.have.property('_ref');
					res.body.car.should.have.property('owner').eql('1');
					res.body.car.should.have
						.property('properties')
						.eql([{ name: 'color', value: 'verde' }]);
					chai
						.request(server)
						.put(url + '/1/cars/1' + suffix)
						.send({
							_ref: res.body.car._ref,
							properties: [{ name: 'color', value: 'negro' }],
						})
						.end((e, r) => {
							r.should.have.status(200);
							r.body.should.be.a('object');
							r.body.should.have.property('metadata');
							r.body.metadata.should.have.property('version');
							r.body.should.have.property('car');
							r.body.car.should.have.property('id');
							r.body.car.should.have.property('_ref');
							r.body.car.should.have.property('owner');
							r.body.car.should.have
								.property('properties')
								.eql([{ name: 'color', value: 'negro' }]);
							done();
						});
				});
		});

		it('PUT action with no _ref parameter', done => {
			chai
				.request(server)
				.put(url + '/1/cars/1' + suffix)
				.send({
					properties: [{ name: 'color', value: 'negro' }],
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no properties parameter', done => {
			chai
				.request(server)
				.put(url + '/1/cars/1' + suffix)
				.send({
					_ref: 'f45tgh67uj',
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with empty properties parameter', done => {
			chai
				.request(server)
				.put(url + '/1/cars/1' + suffix)
				.send({
					_ref: 'f45tgh67uj',
					properties: [],
				})
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action on no resource', done => {
			chai
				.request(server)
				.put(url + '/1/cars/6' + suffix)
				.send({
					_ref: 'f45tgh67uj',
					properties: [{ name: 'color', value: 'negro' }],
				})
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Auto inexistente');
					done();
				});
		});

		it('PUT action with bad _ref parameter', done => {
			chai
				.request(server)
				.put(url + '/1/cars/1' + suffix)
				.send({
					_ref: 'f45tgh67uj',
					properties: [{ name: 'color', value: 'negro' }],
				})
				.end((err, res) => {
					res.should.have.status(409);
					res.body.should.be.a('object');
					res.body.should.have.property('code');
					res.body.should.have
						.property('message')
						.eql('Conflicto en el update');
					done();
				});
		});
	});
});
