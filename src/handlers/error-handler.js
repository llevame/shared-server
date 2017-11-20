// manages common error responces

function unexpected(error) {
	
	return {
		code: error.status,
		message: error.message
	};
}

function invalidToken(error) {
	
	return {
		code: 401,
		message: error.message
	};
}

function missingParameters() {
	
	return {
		code: 400,
		message: "Parámetros faltantes"
	};
}

function idFieldModification() {
	
	return {
		code: 500,
		message: "No se puede actualizar el campo id"
	};
}

function noResource() {

	return {
		code: 404,
		message: "No existe el recurso solicitado"
	};
}

function updateConflict() {

	return {
		code: 409,
		message: "Conflicto en el update"
	};
}

function unathoAccess() {
	
	return {
		code: 401,
		message: "Acceso no autorizado"
	};
}

function faillingValidation() {

	return {
		code: 400,
		message: "Validación fallida"
	};
}

function noCar() {

	return {
		code:404,
		message: "Auto inexistente"
	};
}

function inactiveRule() {
	
	return {
		code: 500,
		message: 'Alguna regla está inactiva'
	};
}

function incorrectRuleLanguage() {
	
	return {
		code: 500,
		message: 'Lenguaje de reglas incorrecto'
	};
}

module.exports = {unexpected, unathoAccess,
				updateConflict, noResource,
				idFieldModification, missingParameters,
				faillingValidation, noCar,
				invalidToken, inactiveRule,
				incorrectRuleLanguage};
