import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import Menu from '../Menu';

class RunAllRules extends Component {

	constructor(props) {
		super(props);
		this.state = {
			facts: "",
			rules: "",
			result: {},
			hide: true,
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
		let rules = JSON.parse(this.state.rules);
		facts = facts.map((fact) => {
			return {
				language: 'node-rules/javascript',
				blob: JSON.stringify(fact)
			};
		});
		rules = rules.map((rule) => {
			return rule.toString();
		});
		fetch('/api/rules/run?token=' + e.target.token.value, {
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
					result: {},
					hide: true
				});
				alert(`An error has ocurred:\n\ncode: ${json.code}\nmessage: ${json.message}\n`);
			} else {
				this.setState({
					...this.state,
					result: json.facts,
					hide: false
				});
			}
		});
	}

	render() {
		let r = "Ej: [1, 4, 5] - run this rules";
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
					<input type="text" placeholder="Token" name="token" />
					<br /><br />
					<input type="submit" value="Run" />
					<h4>Rules:</h4>
					<CodeMirror value={r} options={this.config} onChange={this.setRules}/>
					<h4>Facts:</h4>
					<CodeMirror value={f} options={this.config} onChange={this.setFacts}/>
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default RunAllRules;