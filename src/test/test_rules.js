process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');

chai.use(chaiHttp);

var tokenGenerator = require('../libs/service');
var token = tokenGenerator.createBusinessToken({id: 1, roles: ["admin"]});
var suffix = '?token=' + token;

describe('rules tests', () => {
/*
	describe('/rules', () => {

		it('GET action', (done) => {
			chai.request(server)
				.get('/api/rules' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/rules');
					done();
				});
		});

		it('POST action', (done) => {
			chai.request(server)
				.post('/api/rules' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('POST');
					res.body.should.have.property('url').eql('/api/rules');
					done();
				});
		});		
	});

	describe('/rules/:ruleId', (done) => {

		it('GET action', (done) => {
			chai.request(server)
				.get('/api/rules/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/rules/1');
					done();
				});
		});

		it('PUT action', (done) => {
			chai.request(server)
				.put('/api/rules/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('PUT');
					res.body.should.have.property('url').eql('/api/rules/1');
					done();
				});
		});

		it('DELETE action', (done) => {
			chai.request(server)
				.delete('/api/rules/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('DELETE');
					res.body.should.have.property('url').eql('/api/rules/1');
					done();
				});
		});
	});

	describe('/rules/:ruleId/run', () => {

		it('POST action', (done) => {
			chai.request(server)
				.post('/api/rules/1/run' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('POST');
					res.body.should.have.property('url').eql('/api/rules/1/run');
					done();
				});
		});
	});

	describe('/rules/run', () => {

		it('POST action', (done) => {
			chai.request(server)
				.post('/api/rules/run' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('POST');
					res.body.should.have.property('url').eql('/api/rules/run');
					done();
				});
		});
	});

	describe('/rules/:ruleId/commits', () => {

		it('GET action', (done) => {
			chai.request(server)
				.get('/api/rules/1/commits' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/rules/1/commits');
					done();
				});
		});
	});

	describe('/rules/:ruleId/commits/:commitId', () => {

		it('GET action', (done) => {
			chai.request(server)
				.get('/api/rules/1/commits/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('type').eql('GET');
					res.body.should.have.property('url').eql('/api/rules/1/commits/1');
					done();
				});
		});
	});
*/
});