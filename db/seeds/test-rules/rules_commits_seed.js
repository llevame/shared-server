var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('rules_commits').del()
		.then(() => {
			return knex('rules_commits').insert({
				message: 'New rule',
				rule: "{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}",
				active: true,
				rule_id: 1,
				author: {
					id: 1,
					_ref: uuid(),
					username: 'juan123',
					password: '123',
					name: 'juan',
					surname: 'lopez',
					roles: ["admin"]
				}
			});
		})
		.then(() => {
			return knex('rules_commits').insert({
				message: 'New rule',
				rule: "{condition: function (R) {\n R.when(this && this.transactionTotal < 500);\n},\n consequence: function (R) {\n this.result = false;\n R.stop();\n}\n}",
				active: false,
				rule_id: 2,
				author: {
					id: 1,
					_ref: uuid(),
					username: 'juan123',
					password: '123',
					name: 'juan',
					surname: 'lopez',
					roles: ["admin"]
				}
			});
		});
};
