var knex = require('./knex.js');

function BusinessRoles() {
	return knex('business_roles');
}

function BusinessUsers() {
	return knex('business_users');
}

// queries wrappers

function getAll() {
	return BusinessUsers().select()
		.innerJoin('business_roles', 'business_users.id', 'business_roles.id');
}

function getBusinessUser(userId) {

	let buaux = BusinessUsers().where('id', parseInt(userId)).first();

	let rolesaux = BusinessUsers().select('rol')
		.innerJoin('business_roles', 'business_users.id', 'business_roles.id')
		.where('id', parseInt(userId));

	let bu = {
		metadata: {
			version: "1.0"
		},
		businessUser: {
			id: userId,
			_ref: "0",
			username: buaux.username,
			password: buaux.password,
			name: buaux.name,
			surname: buaux.surname,
			roles: rolesaux
		}
	};

	return bu;
}

function addBusinessUser(bu) {
	
	let buaux = {
	
		username: bu.username,
		password: bu.password,
		name: bu.name,
		surname: bu.surname,
	};

	let id = BusinessUsers().insert(buaux, 'id');
	let roles = bu.roles;

	for (rol in roles) {
		BusinessRoles().insert(id, roles[rol]);
	}

	return id;
}

module.exports = {getAll, getBusinessUser, addBusinessUser};
