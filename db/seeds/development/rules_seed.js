var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('rules').del()
		.then(() => {
			return knex('rules').insert({
				_ref: uuid(),
				blob: "{condition: function (R) {\n R.when(this && this.distance > 0);\n},\n consequence: function (R) {\n this.cost = 50 + (this.distance/1000)*15;\n this.pay = 30 + (this.distance/1000)*5;\n R.stop();\n}\n}",
				author: {
					id: 0,
					_ref: uuid(),
					username: 'root',
					password: 'root',
					name: 'root',
					surname: 'root',
					roles: ["admin"]
				},
				message: 'New rule',
				timestamp: knex.fn.now(),
				active: true
			});
		});
};