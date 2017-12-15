process.env.NODE_ENV = 'test_transactions';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var config = require('../../knexfile.js')[process.env.NODE_ENV];
var knex = require('knex')(config);

chai.use(chaiHttp);

var url = '/api/users';
var tokenGenerator = require('../libs/service');
var token = tokenGenerator.createAppToken({ id: 1 });
var suffix = '?token=' + token;

describe('users transactions test', () => {
	describe('/users/{userId}/transactions', () => {
		beforeEach(function(done) {
			this.timeout(6000);
			knex.migrate
				.rollback()
				.then(() => knex.migrate.latest())
				.then(() => knex.seed.run([config]))
				.then(() => done());
		});

		afterEach(done => {
			knex.migrate.rollback().then(() => done());
		});

		it('GET action', done => {
			chai
				.request(server)
				.get(url + '/1/transactions' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.should.have.property('transactions');
					res.body.transactions.should.be.a('array');
					done();
				});
		});

		it('POST action', done => {
			chai
				.request(server)
				.post(url + '/1/transactions' + suffix)
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
