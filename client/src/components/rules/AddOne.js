import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import Serial from '../../utils/Serial';
import Menu from '../Menu';

class AddRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rule: '',
		};
		this.config = {
			mode: 'javascript',
			lineNumbers: true,
			tabSize: 2,
			identWithTabs: true,
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
		e.preventDefault();
		let credentials = {
			language: 'node-rules/javascript',
			blob: this.state.rule,
			active: true,
		};
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/rules?token=' + token, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
			})
				.then(res => res.json())
				.then(json => {
					if (json.code) {
						alert(
							`An error has ocurred:\n\ncode: ${
								json.code
							}\nmessage: ${json.message}\n`
						);
					} else {
						alert(`Rule has been added with id: ${json.rule.id}`);
					}
				});
		}
	}

	render() {
		let r =
			'Ej: add this rule\n' +
			Serial.serialize(
				{
					condition: function(R) {
						R.when(this && this.transactionTotal < 500);
					},
					consequence: function(R) {
						this.result = false;
						R.stop();
					},
				},
				{ space: 2 }
			);
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onAddRule}>
					<h4>Rule:</h4>
					<CodeMirror
						value={r}
						options={this.config}
						onChange={this.setRule}
					/>
					<input type="submit" value="Add" />
				</form>
			</div>
		);
	}
}

export default AddRule;
