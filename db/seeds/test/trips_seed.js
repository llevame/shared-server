
exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('trips').del()
		.then(() => {
			return knex('trips').insert({
				"driver": "1",
				"passenger": "2",
				"start": {
					"address": {
						"street": "Ituzaingó",
						"location": {
							"lat": 0,
							"lon": 0
						}
					},
					"timestamp": 1435346
				},
				"end": {
					"address": {
						"street": "Brasil",
						"location": {
							"lat": 0,
							"lon": 0
						}
					},
					"timestamp": 34567654
				},
				"totalTime": 10,
				"waitTime": 2,
				"travelTime": 8,
				"distance": 10000,
				"route": [
					{
						"location": {
							"lat": 0,
							"lon": 0
						},
						"timestamp": 0
					}
				]
			});
		});
