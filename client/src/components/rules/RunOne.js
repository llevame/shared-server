import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import Menu from '../Menu';

class RunOneRule extends Component {

	constructor(props) {
		super(props);
		this.state = {
			facts: "",
			result: {},
			hide: true,
		};
		this.config = {
			mode: 'javascript',
			lineNumbers: true,
			tabSize: 2,
			identWithTabs: true
		};
		this.onRunRule = this.onRunRule.bind(this);
		this.setFacts = this.setFacts.bind(this);
	}

	setFacts(text) {
		this.setState({
			...this.state,
			facts: text,
		});
	}

	onRunRule(e) {
		e.preventDefault();
		let facts = JSON.parse(this.state.facts);
		facts = facts.map((fact) => {
			return {
				language: 'node-rules/javascript',
				blob: JSON.stringify(fact)
			};
		});
		fetch('/api/rules/' + e.target.id.value + '/run?token=' + e.target.token.value, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(facts)
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
				<form className="Form" onSubmit={this.onRunRule}>
					<input type="text" placeholder="Token" name="token" />
					<br /><br />
					<input type="text" placeholder="Rule Id" name="id" />
					<input type="submit" value="Run" />
					<h4>Facts:</h4>
					<CodeMirror value={f} options={this.config} onChange={this.setFacts}/>
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default RunOneRule;