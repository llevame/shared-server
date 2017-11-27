process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

var tokenGenerator = require('../libs/service');
var token = tokenGenerator.createAppToken({id: 1});
var businessToken = tokenGenerator.createBusinessToken({id: 1, roles: ["admin"]});
var suffix = '?token=' + token;
var businessSuffix = '?token=' + businessToken;

describe('trips tests', () => {

	describe('/trips/{tripId}', () => {
		
		beforeEach(function(done) {
			this.timeout(4000);
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
				.get('/api/trips/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('trip');
					res.body.trip.should.have.property('id');
					res.body.trip.should.have.property('applicationOwner');
					res.body.trip.should.have.property('driver');
					res.body.trip.should.have.property('passenger');
					res.body.trip.should.have.property('start');
					res.body.trip.start.should.have.property('address');
					res.body.trip.start.should.have.property('timestamp');
					res.body.trip.should.have.property('end');
					res.body.trip.end.should.have.property('address');
					res.body.trip.end.should.have.property('timestamp');
					res.body.trip.should.have.property('totalTime');
					res.body.trip.should.have.property('waitTime');
					res.body.trip.should.have.property('travelTime');
					res.body.trip.should.have.property('distance');
					res.body.trip.should.have.property('route');
					res.body.trip.should.have.property('cost');
					res.body.trip.cost.should.have.property('currency');
					res.body.trip.cost.should.have.property('value');
					done();
				});
		});

		it('GET action with no token', (done) => {
			chai.request(server)
				.get('/api/trips/1')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(401);
					res.body.should.have.property('message').eql('Acceso no autorizado');
					done();
				});
		});

		it('GET action on non-existing trip', (done) => {
			chai.request(server)
				.get('/api/trips/2' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.have.property('code');
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});
	});

	describe('/trips', () => {
		
		beforeEach(function(done) {
			this.timeout(4000);
			knex.migrate.rollback()
			.then(() => knex.migrate.latest())
			.then(() => knex.seed.run())
			.then(() => done());
		});

		afterEach(function(done) {
			this.timeout(4000);
			knex.migrate.rollback()
			.then(() => done());
		});

		it('POST action', (done) => {
			let t = {
				"trip": {
					"driver": "3",
					"passenger": "1",
					"start": {
						"address": {
							"street": "Paseo Colón 850",
							"location": {
								"lat": -34.61770932655934,
								"lon": -58.36873590946197
							}
						},
						"timestamp": 1510769400
					},
					"end": {
						"address": {
							"street": "Las Heras 2200",
							"location": {
								"lat": -34.58833750880012,
								"lon": -58.396180272102356
							}
						},
						"timestamp": 1510770600
					},
					"totalTime": 1320,
					"waitTime": 120,
					"travelTime": 1200,
					"distance": 10000,
					"route": [
						{
							"location": {
								"lat": 0,
								"lon": 0
							},
							"timestamp": 0
						}
					]
				},
				"paymethod": {
					"paymethod": "card",
					"parameters": {
						"ccvv": "1234",
						"expiration_month": "11",
						"expiration_year": "18",
						"number": "13456789765432",
						"type": "Visa",
						"method": "card"
					}
				}
			};
			chai.request(server)
				.post('/api/trips' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('trip');
					res.body.trip.should.have.property('id');
					res.body.trip.should.have.property('applicationOwner');
					res.body.trip.should.have.property('driver');
					res.body.trip.should.have.property('passenger');
					res.body.trip.should.have.property('start');
					res.body.trip.start.should.have.property('address');
					res.body.trip.start.should.have.property('timestamp');
					res.body.trip.should.have.property('end');
					res.body.trip.end.should.have.property('address');
					res.body.trip.end.should.have.property('timestamp');
					res.body.trip.should.have.property('totalTime');
					res.body.trip.should.have.property('waitTime');
					res.body.trip.should.have.property('travelTime');
					res.body.trip.should.have.property('distance');
					res.body.trip.should.have.property('route');
					res.body.trip.should.have.property('cost');
					res.body.trip.cost.should.have.property('currency');
					res.body.trip.cost.should.have.property('value');
					done();
				});
		});

		it('POST action with no token', (done) => {
			chai.request(server)
				.post('/api/trips')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(401);
					res.body.should.have.property('message').eql('Acceso no autorizado');
					done();
				});
		});

		it('POST action with no driver parameter', (done) => {
			let t = {
				"trip": {
					"passenger": "1",
					"start": {
						"address": {
							"street": "Paseo Colón 850",
							"location": {
								"lat": -34.61770932655934,
								"lon": -58.36873590946197
							}
						},
						"timestamp": 1510769400
					},
					"end": {
						"address": {
							"street": "Las Heras 2200",
							"location": {
								"lat": -34.58833750880012,
								"lon": -58.396180272102356
							}
						},
						"timestamp": 1510770600
					},
					"totalTime": 1320,
					"waitTime": 120,
					"travelTime": 1200,
					"distance": 10000,
					"route": [
						{
							"location": {
								"lat": 0,
								"lon": 0
							},
							"timestamp": 0
						}
					]
				},
				"paymethod": {
					"paymethod": "card",
					"parameters": {
						"ccvv": "1234",
						"expiration_month": "11",
						"expiration_year": "18",
						"number": "13456789765432",
						"type": "Visa",
						"method": "card"
					}
				}
			};
			chai.request(server)
				.post('/api/trips' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no passenger parameter', (done) => {
			let t = {
				"trip": {
					"driver": "3",
					"start": {
						"address": {
							"street": "Paseo Colón 850",
							"location": {
								"lat": -34.61770932655934,
								"lon": -58.36873590946197
							}
						},
						"timestamp": 1510769400
					},
					"end": {
						"address": {
							"street": "Las Heras 2200",
							"location": {
								"lat": -34.58833750880012,
								"lon": -58.396180272102356
							}
						},
						"timestamp": 1510770600
					},
					"totalTime": 1320,
					"waitTime": 120,
					"travelTime": 1200,
					"distance": 10000,
					"route": [
						{
							"location": {
								"lat": 0,
								"lon": 0
							},
							"timestamp": 0
						}
					]
				},
				"paymethod": {
					"paymethod": "card",
					"parameters": {
						"ccvv": "1234",
						"expiration_month": "11",
						"expiration_year": "18",
						"number": "13456789765432",
						"type": "Visa",
						"method": "card"
					}
				}
			};
			chai.request(server)
				.post('/api/trips' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no start parameter', (done) => {
			let t = {
				"trip": {
					"passenger": "1",
					"driver": "3",
					"end": {
						"address": {
							"street": "Las Heras 2200",
							"location": {
								"lat": -34.58833750880012,
								"lon": -58.396180272102356
							}
						},
						"timestamp": 1510770600
					},
					"totalTime": 1320,
					"waitTime": 120,
					"travelTime": 1200,
					"distance": 10000,
					"route": [
						{
							"location": {
								"lat": 0,
								"lon": 0
							},
							"timestamp": 0
						}
					]
				},
				"paymethod": {
					"paymethod": "card",
					"parameters": {
						"ccvv": "1234",
						"expiration_month": "11",
						"expiration_year": "18",
						"number": "13456789765432",
						"type": "Visa",
						"method": "card"
					}
				}
			};
			chai.request(server)
				.post('/api/trips' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no end parameter', (done) => {
			let t = {
				"trip": {
					"passenger": "1",
					"driver": "3",
					"start": {
						"address": {
							"street": "Paseo Colón 850",
							"location": {
								"lat": -34.61770932655934,
								"lon": -58.36873590946197
							}
						},
						"timestamp": 1510769400
					},
					"totalTime": 1320,
					"waitTime": 120,
					"travelTime": 1200,
					"distance": 10000,
					"route": [
						{
							"location": {
								"lat": 0,
								"lon": 0
							},
							"timestamp": 0
						}
					]
				},
				"paymethod": {
					"paymethod": "card",
					"parameters": {
						"ccvv": "1234",
						"expiration_month": "11",
						"expiration_year": "18",
						"number": "13456789765432",
						"type": "Visa",
						"method": "card"
					}
				}
			};
			chai.request(server)
				.post('/api/trips' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no paymethod parameter', (done) => {
			let t = {
				"trip": {
					"passenger": "1",
					"driver": "3",
					"start": {
						"address": {
							"street": "Paseo Colón 850",
							"location": {
								"lat": -34.61770932655934,
								"lon": -58.36873590946197
							}
						},
						"timestamp": 1510769400
					},
					"end": {
						"address": {
							"street": "Las Heras 2200",
							"location": {
								"lat": -34.58833750880012,
								"lon": -58.396180272102356
							}
						},
						"timestamp": 1510770600
					},
					"totalTime": 1320,
					"waitTime": 120,
					"travelTime": 1200,
					"distance": 10000,
					"route": [
						{
							"location": {
								"lat": 0,
								"lon": 0
							},
							"timestamp": 0
						}
					]
				}
			};
			chai.request(server)
				.post('/api/trips' + suffix)
				.send(t)
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
				.get('/api/trips' + businessSuffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('trips');
					res.body.trips[0].should.have.property('id');
					res.body.trips[0].should.have.property('applicationOwner');
					res.body.trips[0].should.have.property('driver');
					res.body.trips[0].should.have.property('passenger');
					res.body.trips[0].should.have.property('start');
					res.body.trips[0].start.should.have.property('address');
					res.body.trips[0].start.should.have.property('timestamp');
					res.body.trips[0].should.have.property('end');
					res.body.trips[0].end.should.have.property('address');
					res.body.trips[0].end.should.have.property('timestamp');
					res.body.trips[0].should.have.property('waitTime');
					res.body.trips[0].should.have.property('travelTime');
					res.body.trips[0].should.have.property('distance');
					res.body.trips[0].should.have.property('route');
					res.body.trips[0].should.have.property('cost');
					res.body.trips[0].cost.should.have.property('currency');
					res.body.trips[0].cost.should.have.property('value');
					done();
				});
		});
	});

	describe('/trips/estimate', () => {

		beforeEach(function(done) {
			this.timeout(4000);
			knex.migrate.rollback()
			.then(() => knex.migrate.latest())
			.then(() => knex.seed.run())
			.then(() => done());
		});

		afterEach(function(done) {
			this.timeout(4000);
			knex.migrate.rollback()
			.then(() => done());
		});

		it('POST action', (done) => {
			let t = {
				"passenger": "1",
				"start": {
					"address": {
						"street": "Paseo Colón 850",
						"location": {
							"lat": -34.61770932655934,
							"lon": -58.36873590946197
						}
					},
					"timestamp": 1510769400
				},
				"end": {
					"address": {
						"street": "Las Heras 2200",
						"location": {
							"lat": -34.58833750880012,
							"lon": -58.396180272102356
						}
					},
					"timestamp": 1510770600
				}
			};
			chai.request(server)
				.post('/api/trips/estimate' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('cost');
					res.body.cost.should.have.property('currency');
					res.body.cost.should.have.property('value');
					done();
				});
		});

		it('POST action with no token', (done) => {
			chai.request(server)
				.post('/api/trips/estimate')
				.end((err, res) => {
					res.should.have.status(401);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(401);
					res.body.should.have.property('message').eql('Acceso no autorizado');
					done();
				});
		});

		it('POST action with no passenger parameter', (done) => {
			let t = {
				"start": {
					"address": {
						"street": "Paseo Colón 850",
						"location": {
							"lat": -34.61770932655934,
							"lon": -58.36873590946197
						}
					},
					"timestamp": 1510769400
				},
				"end": {
					"address": {
						"street": "Las Heras 2200",
						"location": {
							"lat": -34.58833750880012,
							"lon": -58.396180272102356
						}
					},
					"timestamp": 1510770600
				}
			};
			chai.request(server)
				.post('/api/trips/estimate' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no start parameter', (done) => {
			let t = {
				"passenger": "1",
				"end": {
					"address": {
						"street": "Las Heras 2200",
						"location": {
							"lat": -34.58833750880012,
							"lon": -58.396180272102356
						}
					},
					"timestamp": 1510770600
				}
			};
			chai.request(server)
				.post('/api/trips/estimate' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no end parameter', (done) => {
			let t = {
				"passenger": "1",
				"start": {
					"address": {
						"street": "Paseo Colón 850",
						"location": {
							"lat": -34.61770932655934,
							"lon": -58.36873590946197
						}
					},
					"timestamp": 1510769400
				}
			};
			chai.request(server)
				.post('/api/trips/estimate' + suffix)
				.send(t)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});
	});
});
