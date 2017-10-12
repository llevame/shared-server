process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should;
var server = require('../index');

chai.use(chaiHttp);

describe('/users tests', () => {

	it('GET action', () => {
		chai.request(server)
			.get('/api/users')
			.end((err, res) => {
				res.body.should.be.eql('GET request on /users');
			});
	});

	it('POST action', () => {
		chai.request(server)
			.post('/api/users')
			.end((err, res) => {
				res.body.should.be.eql('POST request on /users');
			});
	})
});

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
