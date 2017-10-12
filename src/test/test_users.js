process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

describe('/users tests', () => {

	beforeEach(function(done) {
	knex.migrate.rollback()
	.then(function() {
	  knex.migrate.latest()
	  .then(function() {
	    return knex.seed.run()
	    .then(function() {
	      done();
	    });
	  });
	});
	});

	afterEach(function(done) {
		knex.migrate.rollback()
		.then(function() {
			done();
		});
	});

	it('GET action', (done) => {
		chai.request(server)
			.get('/api/users')
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


	it('POST action', () => {
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
			.post('/api/users')
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
			});
	})

});
/*
describe('/users/validate tests', () => {

	it('GET action', () => {
		chai.request(server)
			.get('/api/users/validate')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /users/validate');
			});
	});
});

describe('/users/{userId} tests', () => {

	it('GET action', () => {
		chai.request(server)
			.get('/api/users/1')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /users/1');
			});
	});

	it('PUT action', () => {
		chai.request(server)
			.put('/api/users/1')
			.end((err, res) => {
				res.body.should.be.eql('PUT request on /users/1');
			});
	})

	it('DELETE action', () => {
		chai.request(server)
			.delete('/api/users/1')
			.end((err, res) => {
				res.body.should.be.eql('DELETE request on /users/1');
			});
	})

});

describe('/users/{userId}/trips', () => {

	it('GET action', () => {
		chai.request(server)
			.get('/api/users/1/trips')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /users/1/trips');
			});
	});
});

describe('/users/{userId}/cars tests', () => {

	it('GET action', () => {
		chai.request(server)
			.get('/api/users/1/cars')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /users/1/cars');
			});
	});

	it('POST action', () => {
		chai.request(server)
			.post('/api/users/1/cars')
			.end((err, res) => {
				res.body.should.be.eql('PUT request on /users/1/cars');
			});
	})
});

describe('/users/{userId}/cars/{carId} tests', () => {

	it('GET action', () => {
		chai.request(server)
			.get('/api/users/1/cars/1')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /users/1/cars/1');
			});
	});

	it('PUT action', () => {
		chai.request(server)
			.put('/api/users/1/cars/1')
			.end((err, res) => {
				res.body.should.be.eql('PUT request on /users/1/cars/1');
			});
	})

	it('DELETE action', () => {
		chai.request(server)
			.delete('/api/users/1/cars/1')
			.end((err, res) => {
				res.body.should.be.eql('DELETE request on /users/1/cars/1');
			});
	})

});

describe('/users/{userId}/transactions tests', () => {

	it('GET action', () => {
		chai.request(server)
			.get('/api/users/1/transactions')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /users/1/transactions');
			});
	});

	it('POST action', () => {
		chai.request(server)
			.post('/api/users/1/transactions')
			.end((err, res) => {
				res.body.should.be.eql('PUT request on /users/1/transactions');
			});
	})
});
*/
