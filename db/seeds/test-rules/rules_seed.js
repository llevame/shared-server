var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('rules').del()
		.then(() => {
			return knex('rules').insert({
				_ref: uuid(),
				blob: "{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}",
				author: {
					id: 1,
					_ref: uuid(),
					username: 'juan123',
					password: '123',
					name: 'juan',
					surname: 'lopez',
					roles: ["admin"]
				},
				message: 'New rule',
				timestamp: knex.fn.now(),
				active: true
			});
		})
		.then(() => {
			return knex('rules').insert({
				_ref: uuid(),
				blob: "{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}",
				author: {
					id: 1,
					_ref: uuid(),
					username: 'juan123',
					password: '123',
					name: 'juan',
					surname: 'lopez',
					roles: ["admin"]
				},
				message: 'New rule',
				timestamp: knex.fn.now(),
				active: false
			});
		});
};