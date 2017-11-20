
exports.seed = function(knex, Promise) {

	// Deletes ALL existing entries
	return knex('trips').del()
		.then(() => {
			return knex('trips').insert({
				"driver": "3",
				"passenger": "1",
				"start": {
					"address": {
						"street": "Paseo Colón 850",
						"location": {
							"lat": -34.61770932655934,
							"lon": -58.36873590946197
						}
					},
					"timestamp": 1510769400
				},
				"end": {
					"address": {
						"street": "Las Heras 2200",
						"location": {
							"lat": -34.58833750880012,
							"lon": -58.396180272102356
						}
					},
					"timestamp": 1510770600
				},
				"waitTime": 120,
				"travelTime": 1200,
				"distance": 10000,
				"route": [
					{
						"location": {
							"lat": 0,
							"lon": 0
						},
						"timestamp": 0
					}
				],
				"cost": {
					"currency": "ARS",
					"value": 97.5
				},
				"paymethod": {
					"paymethod": "card",
					"parameters": {
						"ccvv": "1234",
						"expiration_month": "11",
						"expiration_year": "18",
						"number": "13456789765432",
						"type": "Visa",
						"method": "card"
					}
				}
			});
		});
};
