var v = require('../../package.json').version;

function createResponse(stats) {
	var group_to_values, groups;

	if (stats.length > 0) {
		group_to_values = stats.reduce((r, s) => {
			r[s.app_id] = r[s.app_id] || [];
			r[s.app_id].push({
				endpoint: s.endpoint,
				method: s.method,
				total: s.total,
			});

			return r;
		}, {});

		groups = Object.keys(group_to_values).map(key => {
			return {
				app_server_id: key,
				statistics: group_to_values[key],
			};
		});
	} else {
		groups = [];
	}

	return {
		metadata: {
			version: v,
			count: groups.length,
			total: groups.length,
		},
		serversStatistics: groups,
	};
}

module.exports = { createResponse };
