process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = require('chai').should();
var handler = require('../handlers/error-handler');

describe('errors handlers tests', () => {
	it('unexpected', done => {
		let e = handler.unexpected({ status: 500, message: 'Some error' });
		e.should.have.property('code').eql(500);
		e.should.have.property('message').eql('Some error');
		done();
	});

	it('invalidToken', done => {
		let e = handler.invalidToken({ message: 'jwt malformed' });
		e.should.have.property('code').eql(401);
		e.should.have.property('message').eql('jwt malformed');
		done();
	});

	it('missingParameters', done => {
		let e = handler.missingParameters();
		e.should.have.property('code').eql(400);
		e.should.have.property('message').eql('Parámetros faltantes');
		done();
	});

	it('idFieldModification', done => {
		let e = handler.idFieldModification();
		e.should.have.property('code').eql(500);
		e.should.have
			.property('message')
			.eql('No se puede actualizar el campo id');
		done();
	});

	it('noResource', done => {
		let e = handler.noResource();
		e.should.have.property('code').eql(404);
		e.should.have
			.property('message')
			.eql('No existe el recurso solicitado');
		done();
	});

	it('updateConflict', done => {
		let e = handler.updateConflict();
		e.should.have.property('code').eql(409);
		e.should.have.property('message').eql('Conflicto en el update');
		done();
	});

	it('unathoAccess', done => {
		let e = handler.unathoAccess();
		e.should.have.property('code').eql(401);
		e.should.have.property('message').eql('Acceso no autorizado');
		done();
	});

	it('faillingValidation', done => {
		let e = handler.faillingValidation();
		e.should.have.property('code').eql(400);
		e.should.have.property('message').eql('Validación fallida');
		done();
	});

	it('noCar', done => {
		let e = handler.noCar();
		e.should.have.property('code').eql(404);
		e.should.have.property('message').eql('Auto inexistente');
		done();
	});

	it('inactiveRule', done => {
		let e = handler.inactiveRule();
		e.should.have.property('code').eql(500);
		e.should.have.property('message').eql('Alguna regla está inactiva');
		done();
	});

	it('incorrectRuleLanguage', done => {
		let e = handler.incorrectRuleLanguage();
		e.should.have.property('code').eql(500);
		e.should.have.property('message').eql('Lenguaje de reglas incorrecto');
		done();
	});
});
