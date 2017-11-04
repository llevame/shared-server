process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var server = require('../index');
var knex = require('../../db/knex');

chai.use(chaiHttp);

var tokenGenerator = require('../libs/service');
var token = tokenGenerator.createBusinessToken({id: 1, roles: ["admin"]});
var suffix = '?token=' + token;

describe('rules tests', () => {

	describe('/rules', () => {

		beforeEach(function(done) {
			this.timeout(3000);
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
				.get('/api/rules' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('count').eql(res.body.rules.length);
					res.body.metadata.should.have.property('total').eql(res.body.rules.length);
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('rules');
					res.body.rules.should.be.a('array');
					res.body.rules[0].should.have.property('id');
					res.body.rules[0].should.have.property('_ref');
					res.body.rules[0].should.have.property('blob');
					res.body.rules[0].should.have.property('active');
					res.body.rules[0].should.have.property('language');
					res.body.rules[0].should.have.property('lastCommit');
					res.body.rules[0].lastCommit.should.have.property('author');
					res.body.rules[0].lastCommit.should.have.property('message');
					res.body.rules[0].lastCommit.should.have.property('timestamp');
					done();
				});
		});

		it('POST action', (done) => {
			let r = {
				language: 'node-rules/javascript',
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.post('/api/rules' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('rule');
					res.body.rule.should.have.property('id');
					res.body.rule.should.have.property('_ref');
					res.body.rule.should.have.property('blob');
					res.body.rule.should.have.property('active');
					res.body.rule.should.have.property('language');
					res.body.rule.should.have.property('lastCommit');
					res.body.rule.lastCommit.should.have.property('author');
					res.body.rule.lastCommit.should.have.property('message');
					res.body.rule.lastCommit.should.have.property('timestamp');
					res.body.rule.lastCommit.should.have.property('id');
					done();
				});
		});

		it('POST action with no language parameter', (done) => {
			let r = {
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.post('/api/rules' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});
		
		it('POST action with no active parameter', (done) => {
			let r = {
				language: 'node-rules/javascript',
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}'
			};
			chai.request(server)
				.post('/api/rules' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with no blob parameter', (done) => {
			let r = {
				language: 'node-rules/javascript',
				active: true
			};
			chai.request(server)
				.post('/api/rules' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('POST action with incorrect language parameter', (done) => {
			let r = {
				language: 'node-rules',
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.post('/api/rules' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(500);
					res.body.should.have.property('message').eql('Lenguaje de reglas incorrecto');
					done();
				});
		});
	});

	describe('/rules/:ruleId', (done) => {

		beforeEach(function(done) {
			this.timeout(3000);
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
				.get('/api/rules/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('rule');
					res.body.rule.should.have.property('id');
					res.body.rule.should.have.property('_ref');
					res.body.rule.should.have.property('blob');
					res.body.rule.should.have.property('active');
					res.body.rule.should.have.property('language');
					res.body.rule.should.have.property('lastCommit');
					res.body.rule.lastCommit.should.have.property('author');
					res.body.rule.lastCommit.should.have.property('message');
					res.body.rule.lastCommit.should.have.property('timestamp');
					done();
				});
		});

		it('GET action on no resource', (done) => {
			chai.request(server)
				.get('/api/rules/2' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(404);
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});

		it('PUT action', (done) => {
			chai.request(server)
				.get('/api/rules/1' + suffix)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('metadata');
					res.body.metadata.should.have.property('version');
					res.body.should.have.property('rule');
					res.body.rule.should.have.property('id');
					res.body.rule.should.have.property('_ref');
					res.body.rule.should.have.property('blob');
					res.body.rule.should.have.property('active').eql(true);
					res.body.rule.should.have.property('language');
					res.body.rule.should.have.property('lastCommit');
					res.body.rule.lastCommit.should.have.property('author');
					res.body.rule.lastCommit.should.have.property('message').eql('New rule');
					res.body.rule.lastCommit.should.have.property('timestamp');
					chai.request(server)
					.put('/api/rules/1' + suffix)
					.send({
						_ref: res.body.rule._ref,
						blob: res.body.rule.blob,
						language: res.body.rule.language,
						active: false
					})
					.end((e, r) => {
						r.should.have.status(201);
						r.body.should.be.a('object');
						r.body.should.have.property('metadata');
						r.body.metadata.should.have.property('version');
						r.body.should.have.property('rule');
						r.body.rule.should.have.property('id');
						r.body.rule.should.have.property('_ref');
						r.body.rule.should.have.property('blob');
						r.body.rule.should.have.property('active').eql(false);
						r.body.rule.should.have.property('language');
						r.body.rule.should.have.property('lastCommit');
						r.body.rule.lastCommit.should.have.property('author');
						r.body.rule.lastCommit.should.have.property('message').eql('Update rule');
						r.body.rule.lastCommit.should.have.property('timestamp');
						r.body.rule.lastCommit.should.have.property('id');
						done();
					});
				});
		});

		it('PUT action with no _ref parameter', (done) => {
			let r = {
				language: 'node-rules/javascript',
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.put('/api/rules/1' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with no language parameter', (done) => {
			let r = {
				_ref: "fdfef32",
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.put('/api/rules/1' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(400);
					res.body.should.have.property('message').eql('Parámetros faltantes');
					done();
				});
		});

		it('PUT action with incorrect language parameter', (done) => {
			let r = {
				_ref: "cdcds",
				language: 'node-rules',
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.put('/api/rules/1' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(500);
					res.body.should.have.property('message').eql('Lenguaje de reglas incorrecto');
					done();
				});
		});

		it('PUT action on no resource', (done) => {
			let r = {
				_ref: "cdcds",
				language: 'node-rules/javascript',
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.put('/api/rules/2' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(404);
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});

		it('PUT action with bad _ref parameter', (done) => {
			let r = {
				_ref: "cdcds",
				language: 'node-rules/javascript',
				blob: '{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}',
				active: true
			};
			chai.request(server)
				.put('/api/rules/1' + suffix)
				.send(r)
				.end((err, res) => {
					res.should.have.status(409);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(409);
					res.body.should.have.property('message').eql('Conflicto en el update');
					done();
				});
		});

		it('DELETE action', (done) => {
			chai.request(server)
				.delete('/api/rules/1' + suffix)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});

		it('DELETE action on no resource', (done) => {
			chai.request(server)
				.delete('/api/rules/2' + suffix)
				.end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('object');
					res.body.should.have.property('code').eql(404);
					res.body.should.have.property('message').eql('No existe el recurso solicitado');
					done();
				});
		});
	});
/*
	describe('/rules/:ruleId/run', () => {

		beforeEach(function(done) {
			this.timeout(3000);
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

		beforeEach(function(done) {
			this.timeout(3000);
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

		beforeEach(function(done) {
			this.timeout(3000);
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

		beforeEach(function(done) {
			this.timeout(3000);
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