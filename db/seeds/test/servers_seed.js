var uuid = require('uuid/v4');
var moment = require('moment');

exports.seed = function(knex, Promise) {
	
	// Deletes ALL existing entries
	return knex('app_servers').del()
		.then(() => {
			return knex('app_servers').insert({
				_ref: uuid(),
				createdBy: "admin1",
				createdTime: moment().unix(),
				name: "app_server0",
			});
		}).then(() => {
			return knex('app_servers').insert({
				_ref: uuid(),
				createdBy: "admin1",
				createdTime: moment().unix(),
				name: "app_server1",
			});
		}).then(() => {
			return knex('app_servers').insert({
				_ref: uuid(),
				createdBy: "admin1",
				createdTime: moment().unix(),
				name: "app_server2",
			});
		}).then(() => {
			return knex('app_servers').insert({
				_ref: uuid(),
				createdBy: "admin1",
				createdTime: moment().unix(),
				name: "app_server3",
			});
		});
};
