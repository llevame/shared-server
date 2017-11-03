var error = require('../handlers/error-handler');
var rulesQ = require('../../db/queries-wrapper/rules_queries');
var businessQ = require('../../db/queries-wrapper/business_queries');
var commitQ = require('../../db/queries-wrapper/commits_queries');
var builder = require('../builders/rules_builder');
var knex = require('../../db/knex');
var Rules = require('../libs/rules_engine');
var serial = require('../libs/rules_serializer');
var log = require('log4js').getLogger("error");

function checkParameters(body) {
	
	return (body.language && body.blob &&
			(body.active != null));
}

function checkParametersUpdate(body) {
	
	return (checkParameters(body) && body._ref);
}

function checkRunParameters(body) {
	
	return (body.rules && (body.rules.length > 0)
			&& body.facts && (body.facts.length > 0));
}

function checkRunRuleParameters(body) {
	
	return (body.facts && (body.facts.length > 0));
}

function checkRulesState(rules) {
	
	for (r in rules) {
		if (!rules[r].active) {
			return false;
		}
	}
	return true;
}

function run(req, res) {

	if (!checkRunParameters(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	rulesQ.getGroup(req.body.rules)
		.then((rules) => {
			if (!checkRulesState(rules)) {
				return res.status(500).json(error.inactiveRule());
			}
			// We only need the blob part of the result
			rules = rules.map((rule) => rule.blob);
			try {
				// Transform them into JSON format
				let desRules = serial.deserialize(rules);
				let facts = req.body.facts;
				let r = [];
				
				for (var n = 0; n < facts.length; n++) {
					r.push(Rules.execute(desRules, facts[n]));
				}

				Promise.all(r)
					.then((results) => {
						res.status(200).json(builder.createFactResponse(results));
					})
					.catch((err) => {
						log.error("Error: " + err.message + " on: " + req.originalUrl);
						res.status(500).json(error.unexpected(err));
					});

			} catch (e) {

				log.error("Error: " + e.toString() + " on: " + req.originalUrl);
				return res.status(500).json({
					code: 500,
					message: e.toString()
				});
			}
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
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
		return res.status(500).json(error.incorrectRuleLanguage());
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
					active: r.active,
					rule_id: r.id,
					author: user,
					timestamp: r.timestamp
				})
				.then((commitId) => {
					let ru = builder.createResponse(r);
					ru.rule.lastCommit.id = parseInt(commitId);
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

function updateRule(req, res) {

	if (!checkParametersUpdate(req.body)) {
		return res.status(400).json(error.missingParameters());
	}

	if (req.body.language != 'node-rules/javascript') {
		return res.status(500).json(error.unexpected({
			status: 500,
			message: 'Lenguaje de reglas incorrecto'
		}));
	}

	rulesQ.get(req.params.ruleId)
		.then((rule) => {
			if (!rule) {
				return res.status(404).json(error.noResource());
			}
			if (rule._ref !== req.body._ref) {
				return res.status(409).json(error.updateConflict());
			}
			businessQ.get(req.user.id)
				.then((user) => {
					rulesQ.update(req.params.ruleId, {
						blob: req.body.blob,
						author: user,
						timestamp: knex.fn.now(),
						active: req.body.active
					})
					.then((updatedRule) => {
						commitQ.add({
							message: 'Update rule',
							rule: req.body.blob,
							active: updatedRule[0].active,
							rule_id: updatedRule[0].id,
							author: user,
							timestamp: updatedRule[0].timestamp
						})
						.then((commitId) => {
							let ru = builder.createResponse(updatedRule[0]);
							ru.rule.lastCommit.id = parseInt(commitId);
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

function deleteRule(req, res) {
	
	rulesQ.get(req.params.ruleId)
		.then((rule) => {
			if (!rule) {
				return res.status(404).json(error.noResource());
			}

			rulesQ.del(req.params.ruleId)
				.then(() => {
					res.sendStatus(204);
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

function getRuleCommits(req, res) {

	commitQ.getAllOfRule(req.params.ruleId)
		.then((commits) => {
			let r = builder.createCommitsResponse(commits);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

function getRuleStateInCommit(req, res) {
	
	commitQ.get(req.params.commitId)
		.then((commit) => {
			if (!commit) {
				return res.status(404).json(error.noResource());
			}
			if (commit.rule_id != req.params.ruleId) {
				return res.status(500).json(error.unexpected({
					status: 500,
					message: 'Commit no pertenece a la regla'
				}));
			}

			let r = builder.createRuleStateInCommit(commit);
			res.status(200).json(r);
		})
		.catch((err) => {
			log.error("Error: " + err.message + " on: " + req.originalUrl);
			res.status(500).json(error.unexpected(err));
		});
}

module.exports = {run, runRule, postRule,
			getRule, getRules, deleteRule,
			updateRule, getRuleCommits,
			getRuleStateInCommit};
