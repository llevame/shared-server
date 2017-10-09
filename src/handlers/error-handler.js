// manages common error responces

function unexpected(error) {
	
	return {
		code: error.status,
		message: error.nessage
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

module.exports = {unexpected, unathoAccess, updateConflict, noResource, idFieldModification, missingParameters};
