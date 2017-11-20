import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import Serial from '../../utils/Serial';
import Menu from '../Menu';

class RunTestRules extends Component {

	constructor(props) {
		super(props);
		this.state = {
			facts: "",
			rules: "",
			result: "",
			show: false
		};
		this.config = {
			mode: 'javascript',
			lineNumbers: true,
			tabSize: 2,
			identWithTabs: true
		};
		this.onRunRules = this.onRunRules.bind(this);
		this.setFacts = this.setFacts.bind(this);
		this.setRules = this.setRules.bind(this);
	}

	setFacts(text) {
		this.setState({
			...this.state,
			facts: text,
		});
	}

	setRules(text) {
		this.setState({
			...this.state,
			rules: text,
		});
	}

	onRunRules(e) {
		e.preventDefault();
		let facts = JSON.parse(this.state.facts);
		let rules = Serial.deserialize(this.state.rules);
		facts = facts.map((fact) => {
			return {
				language: 'node-rules/javascript',
				blob: JSON.stringify(fact)
			};
		});
		rules = rules.map((rule) => {
			return {
				language: 'node-rules/javascript',
				blob: Serial.serialize(rule)
			};
		});
		fetch('/api/rules/test', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				rules: rules,
				facts: facts
			})
		})
		.then((res) => res.json())
		.then((json) => {
			if (json.code) {
				this.setState({
					...this.state,
					result: "",
					show: false
				});
				alert(`An error has ocurred:\n\ncode: ${json.code}\nmessage: ${json.message}\n`);
			} else {
				let r = json.facts.map((f) => {
					return Serial.deserialize(f.blob);
				});
				this.setState({
					...this.state,
					result: JSON.stringify(r, null, 2),
					show: true
				});
			}
		});
	}

	renderResult() {
		const {result, show} = this.state;

		if (show) {
			return (
				<div>
					<h4>Results:</h4>
					<CodeMirror value={result} options={{...this.config, readOnly: true}}/>
				</div>
			);
		}
	}

	render() {
		let r = "Ej: run this rules\n" + Serial.serialize([{
			condition: function (R) {
				R.when(this && (this.transactionTotal < 500));
			},
			consequence: function (R) {
				this.result = false;
				R.stop();
			}
		}], {space: 2});
		let f = "Ej: fact sample\n" + JSON.stringify([{
			"name": "user1",
			"application": "MOB2",
			"userLoggedIn": true,
			"transactionTotal": 600,
			"cardType": "Credit Card"
		}], null, 2);
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onRunRules}>
					<input type="submit" value="Run" />
					<h4>Rules:</h4>
					<CodeMirror value={r} options={this.config} onChange={this.setRules}/>
					<h4>Facts:</h4>
					<CodeMirror value={f} options={this.config} onChange={this.setFacts}/>
					{this.renderResult()}
				</form>
			</div>
		);
	}
}

export default RunTestRules;