var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('app_users').del()
		.then(() => {
			return knex('app_users').insert({
				_ref: uuid(),
				type: 'passenger',
				username: 'juan123',
				name: 'Juan',
				surname: 'Lopez',
				country: 'Argentina',
				email: 'juan@gmail.com',
				birthdate: '13/1/1990',
				password: '1234',
				fb: {
					userId: "juan1234",
					authToken: "mkmcemke4322"
				},
				images: ["i1", "i2"]
			});
		}).then(() => {
			return knex('app_users').insert({
				_ref: uuid(),
				type: 'passenger',
				username: 'edu123',
				name: 'Eduardo',
				surname: 'Garcia',
				country: 'Argentina',
				email: 'edu@gmail.com',
				birthdate: '13/1/1990',
				password: '1234fdf',
				images: ["i1", "i2"]
			});
		}).then(() => {
			return knex('app_users').insert({
				_ref: uuid(),
				type: 'driver',
				username: 'ale123',
				name: 'Alejandro',
				surname: 'Algo',
				country: 'Argentina',
				email: 'ale@gmail.com',
				birthdate: '13/1/1990',
				password: '123dd4',
				fb: {
					userId: "ale1234",
					authToken: "polkrfke9989"
				},
				images: ["i1", "i2"]
			});
		}).then(() => {
			return knex('app_users').insert({
				_ref: uuid(),
				type: 'driver',
				username: 'fede123',
				name: 'Federico',
				surname: 'Otro',
				country: 'Argentina',
				email: 'fede@gmail.com',
				birthdate: '13/1/1990',
				password: '1dede234',
				fb: {
					userId: "fede1234",
					authToken: "fedekdlñakldek"
				},
				images: ["i1", "i2"]
			});
		}).then(() => {
			return knex('app_users').insert({
				_ref: uuid(),
				type: 'passenger',
				username: 'antonio123',
				name: 'Antonio',
				surname: 'Lopez',
				country: 'Argentina',
				email: 'tony@gmail.com',
				birthdate: '13/1/1990',
				password: '1234',
				fb: {
					userId: "antonio1234",
					authToken: "mkmcverv2322"
				},
				images: ["i1", "i2"]
			});
		});
};
