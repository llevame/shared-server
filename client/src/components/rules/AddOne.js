import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import serialize from 'serialize-javascript';
import Menu from '../Menu';

class AddRule extends Component {

	constructor(props) {
		super(props);
		this.state = {
			rule: "",
			result: {},
			hide: true,
		};
		this.config = {
			mode: 'javascript',
			lineNumbers: true,
			tabSize: 2,
			identWithTabs: true
		};
		this.setRule = this.setRule.bind(this);
		this.onAddRule = this.onAddRule.bind(this);
	}

	setRule(text) {
		this.setState({
			...this.state,
			rule: text,
		});
	}

	onAddRule(e) {
		let credentials = {
			language: 'node-rules/javascript',
			blob: this.state.rule,
			active: true
		};
		fetch('/api/rules?token=' + e.target.token.value, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials)
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
					result: json.rule,
					hide: false
				});
			}
		});
	}

	render() {
		let r = "Ej: add this rule\n" + serialize({
			condition: function (R) {
				R.when(this && (this.transactionTotal < 500));
			},
			consequence: function (R) {
				this.result = false;
				R.stop();
			}
		}, {space: 2});
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onAddRule}>
					<input type="text" placeholder="Token" name="token" />
					<br /><br />
					<input type="submit" value="Add" />
					<h4>Rule:</h4>
					<CodeMirror value={r} options={this.config} onChange={this.setRule}/>
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default AddRule;