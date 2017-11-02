var error = require('../handlers/error-handler');
var rulesQ = require('../../db/queries-wrapper/rules_queries');
var businessQ = require('../../db/queries-wrapper/business_queries');
var commitQ = require('../../db/queries-wrapper/commits_queries');
var builder = require('../builders/rules_builder');
var knex = require('../../db/knex');
var log = require('log4js').getLogger("error");

function checkParameters(body) {
	
	return (body.language && body.blob &&
			body.active);
}

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

	if (!checkParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	if (req.body.language != 'node-rules/javascript') {
		return res.status(500).json(error.unexpected({
			status: 500,
			message: 'Lenguaje de reglas incorrecto'
		}));
	}

	businessQ.get(req.user.id)
		.then((user) => {
			rulesQ.add({
				blob: req.body.blob,
				author: user,
				timestamp: knex.fn.now(),
				active: req.body.active
			})
			.then((ruleId) => {
				return rulesQ.get(ruleId);
			})
			.then((r) => {
				commitQ.add({
					message: 'New rule',
					rule: req.body.blob,
					rule_id: r.id,
					author: user,
					timestamp: r.timestamp
				})
				.then((commitId) => {
					let ru = builder.createResponse(r);
					res.status(201).json(ru);
				})
				.catch((err) => {
					log.error("Error: " + err.message + " on: " + req.originalUrl);
					res.status(500).json(error.unexpected(err));
				});
			})
			.catch((err) => {
				log.error("Error: " + err.message + " on: " + req.originalUrl);
				res.status(500).json(error.unexpected(err));
			});
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

function getRules(req, res) {
	
	rulesQ.getAll()
		.then((rules) => {
			let r = builder.createGetAllResponse(rules);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

function getRule(req, res) {
	
	rulesQ.get(req.params.ruleId)
		.then((rule) => {
			if (!rule) {
				return res.status(404).json(error.noResource());
			}
			
			let r = builder.createResponse(rule)
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
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
