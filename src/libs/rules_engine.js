const RuleEngine = require('node-rules');

// Executes the rules engine with the
// 'fact' provided and loaded with the 'rules'.
function execute(rules, fact) {
	
	return new Promise(resolve => {

		const R = new RuleEngine();
		
		R.fromJSON(rules);
		R.execute(fact, r => resolve(r));
	});
}

module.exports = {execute};