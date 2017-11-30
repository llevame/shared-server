var database = process.env.DEV_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/llevame-server';

module.exports = {
	test: {
		client: 'pg',
		connection:
			'postgres://postgres:postgres@localhost:5432/llevame-server-test',
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds/test',
		},
	},
	test_rules: {
		client: 'pg',
		connection:
			'postgres://postgres:postgres@localhost:5432/llevame-server-test',
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds/test-rules',
		},
	},
	test_transactions: {
		client: 'pg',
		connection:
			'postgres://postgres:postgres@localhost:5432/llevame-server-test',
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds/test-transactions',
		},
	},
	development: {
		client: 'pg',
		connection: database,
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds/development',
		},
	},
	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds/production',
		},
	},
};
