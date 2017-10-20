var error = require('../handlers/error-handler');
var log = require('log4js').getLogger("error");

function run(req, res) {

	res.status(200).json({
		type: 'POST',
		url: '/api/rules/run'
	});
}

function runRule(req, res) {

	res.status(200).json({
		type: 'POST',
		url: '/api/rules/' + req.params.ruleId + '/run'
	});
}

function postRule(req, res) {
	
	res.status(200).json({
		type: 'POST',
		url: '/api/rules'
	});
}

function getRules(req, res) {
	
	res.status(200).json({
		type: 'GET',
		url: '/api/rules'
	});
}

function getRule(req, res) {
	
	res.status(200).json({
		type: 'GET',
		url: '/api/rules/' + req.params.ruleId
	});
}

function updateRule(req, res) {
	
	res.status(200).json({
		type: 'PUT',
		url: '/api/rules/' + req.params.ruleId
	});
}

function deleteRule(req, res) {
	
	res.status(200).json({
		type: 'DELETE',
		url: '/api/rules/' + req.params.ruleId
	});
}

function getRuleCommits(req, res) {
	
	res.status(200).json({
		type: 'GET',
		url: '/api/rules/' + req.params.ruleId + '/commits'
	});
}

function getRuleStateInCommit(req, res) {
	
	res.status(200).json({
		type: 'GET',
		url: '/api/rules/' + req.params.ruleId + '/commits/' + req.params.commitId
	});
}

module.exports = {run, runRule, postRule,
			getRule, getRules, deleteRule,
			updateRule, getRuleCommits,
			getRuleStateInCommit};