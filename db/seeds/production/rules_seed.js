var uuid = require('uuid/v4');
var serial = require('../../../src/libs/rules_serializer');

exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('rules').del()
		.then(() => {
			return knex('rules').insert([
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Initial cost and pay",
					priority: 10,
					condition: function (R) {
						R.when(this.distance > 0);
					},
					consequence: function (R) {
						this.cost = this.hasLlevameDomain ? 0 : 50;
						this.pay = 30;
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Trip distance cost for the passenger",
					priority: 9,
					condition: function (R) {
						R.when(this.distance > 0 && (this.cost > 0));
					},
					consequence: function (R) {
						this.cp.push((this.distance/1000)*15);
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Trip distance gain for the driver",
					priority: 8,
					condition: function (R) {
						R.when(this.distance > 0);
					},
					consequence: function (R) {
						this.pp.push((this.distance/1000)*5);
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Discount - passenger - Wednesday",
					priority: 7,
					condition: function(R) {
						R.when(this &&
							(this.startTime !== null) &&
							(this.endTime !== null) && 
							(this.startDay !== null) && 
							(this.endDay !== null) &&
							(this.startDay === "Wednesday") &&
							(this.startTime >= 15) &&
							(this.endTime < 16));
					},
					consequence: function(R) {
						this.cp.push((-1)*(5*this.cost)/100);
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Charge/Gain - passenger/driver - week days - rush hour",
					priority: 6,
					condition: function(R) {
						var a = ["Monday", "Thursday", "Wednesday", "Tuesday", "Friday"].some((day) => {
							return day == this.startDay;
						});
						R.when(this &&
							(this.startTime !== null) &&
							(this.endTime !== null) && 
							(this.startDay !== null) && 
							(this.endDay !== null) &&
							(a) &&
							(this.startTime >= 17) &&
							(this.endTime < 19));
					},
					consequence: function(R) {
						this.cp.push((10*this.cost)/100);
						this.pp.push((3*this.pay)/100);
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Charge - passenger - trips of the last half hour",
					priority: 5,
					condition: function (R) {
						R.when(this.tripsInTheLastHalfHourPassenger > 10);
					},
					consequence: function (R) {
						this.cp.push((15*this.cost)/100);
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Gain - driver - trips made in the day",
					priority: 4,
					condition: function (R) {
						R.when(this.tripsInTheDayDriver > 10);
					},
					consequence: function (R) {
						this.pp.push((2*this.pay)/100);
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Discount - passenger - trips made in the day",
					priority: 3,
					condition: function (R) {
						R.when(this.tripsInTheDayPassenger >= 5);
					},
					consequence: function (R) {
						this.cp.push((-1)*(5*this.cost)/100);
						R.next();
					}
				}),
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
			},
			{
				_ref: uuid(),
				blob: serial.serialize({
					name: "Discount - passenger - first trip",
					priority: 2,
					condition: function(R) {
						R.when(this && this.isFirstTrip && (this.cost > 0));
					},
					consequence: function(R) {
						this.cp.push((-1)*100);
						R.stop();
					}
				}),
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
			}], 'id');
		})
		.then((rulesIds) => {
			// Deletes ALL existing entries
			return knex('rules_commits').del()
				.then(() => {
					return knex('rules_commits').insert([{
						message: 'New rule',
						rule: serial.serialize({
							name: "Initial cost and pay",
							priority: 10,
							condition: function (R) {
								R.when(this.distance > 0);
							},
							consequence: function (R) {
								this.cost = this.hasLlevameDomain ? 0 : 50;
								this.pay = 30;
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[0],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Trip distance cost for the passenger",
							priority: 9,
							condition: function (R) {
								R.when(this.distance > 0 && (this.cost > 0));
							},
							consequence: function (R) {
								this.cp.push((this.distance/1000)*15);
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[1],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Trip distance gain for the driver",
							priority: 8,
							condition: function (R) {
								R.when(this.distance > 0);
							},
							consequence: function (R) {
								this.pp.push((this.distance/1000)*5);
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[2],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Discount - passenger - Wednesday",
							priority: 7,
							condition: function(R) {
								R.when(this &&
									(this.startTime !== null) &&
									(this.endTime !== null) && 
									(this.startDay !== null) && 
									(this.endDay !== null) &&
									(this.startDay === "Wednesday") &&
									(this.startTime >= 15) &&
									(this.endTime < 16));
							},
							consequence: function(R) {
								this.cp.push((-1)*(5*this.cost)/100);
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[3],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Charge/Gain - passenger/driver - week days - rush hour",
							priority: 6,
							condition: function(R) {
								var a = ["Monday", "Thursday", "Wednesday", "Tuesday", "Friday"].some((day) => {
									return day == this.startDay;
								});
								R.when(this &&
									(this.startTime !== null) &&
									(this.endTime !== null) && 
									(this.startDay !== null) && 
									(this.endDay !== null) &&
									(a) &&
									(this.startTime >= 17) &&
									(this.endTime < 19));
							},
							consequence: function(R) {
								this.cp.push((10*this.cost)/100);
								this.pp.push((3*this.pay)/100);
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[4],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Charge - passenger - trips of the last half hour",
							priority: 5,
							condition: function (R) {
								R.when(this.tripsInTheLastHalfHourPassenger > 10);
							},
							consequence: function (R) {
								this.cp.push((15*this.cost)/100);
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[5],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Gain - driver - trips made in the day",
							priority: 4,
							condition: function (R) {
								R.when(this.tripsInTheDayDriver > 10);
							},
							consequence: function (R) {
								this.pp.push((2*this.pay)/100);
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[6],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Discount - passenger - trips made in the day",
							priority: 3,
							condition: function (R) {
								R.when(this.tripsInTheDayPassenger >= 5);
							},
							consequence: function (R) {
								this.cp.push((-1)*(5*this.cost)/100);
								R.next();
							}
						}),
						active: true,
						rule_id: rulesIds[7],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					},
					{
						message: 'New rule',
						rule: serial.serialize({
							name: "Discount - passenger - first trip",
							priority: 2,
							condition: function(R) {
								R.when(this && this.isFirstTrip && (this.cost > 0));
							},
							consequence: function(R) {
								this.cp.push((-1)*100);
								R.stop();
							}
						}),
						active: true,
						rule_id: rulesIds[8],
						author: {
							id: 0,
							_ref: uuid(),
							username: 'root',
							password: 'root',
							name: 'root',
							surname: 'root',
							roles: ["admin"]
						}
					}]);
				});
		});
};