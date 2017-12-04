import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import TableResults from '../TableResults';
import Menu from '../Menu';

class GetRuleState extends Component {
	constructor(props) {
		super(props);
		this.state = {
			result: {},
			rule: '',
			hide: true,
		};
		this.config = {
			mode: 'javascript',
			lineNumbers: true,
			tabSize: 2,
			identWithTabs: true,
		};
		this.onGet = this.onGet.bind(this);
	}

	onGet(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/rules/' + e.target.rId.value + '/commits/' + e.target.cId.value + '?token=' + token, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then(res => res.json())
			.then(json => {
				if (json.code) {
					this.setState({
						...this.state,
						result: {},
						rule: '',
						hide: true,
					});
					alert(
						`An error has ocurred:\n\ncode: ${
							json.code
						}\nmessage: ${json.message}\n`
					);
				} else {
					let r = {
						id: json.rule.id,
						_ref: json.rule._ref,
						language: json.rule.language,
						active: json.rule.active,
						lastCommit: json.rule.lastCommit,
					};
					this.setState({
						...this.state,
						result: r,
						rule: json.rule.blob,
						hide: false,
					});
				}
			});
		}
	}

	renderResult() {
		if (!this.state.hide) {
			return (
				<div>
					<h4>Information:</h4>
					<TableResults
						result={this.state.result}
						style={{ justifyContent: 'left' }}
					/>
					<h4>Rule:</h4>
					<CodeMirror
						value={this.state.rule}
						options={{ ...this.config, readOnly: true }}
					/>
				</div>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onGet}>
					<input type="text" placeholder="Rule Id" name="rId" />
					<input type="text" placeholder="Commit Id" name="cId" />
					<input type="submit" value="Get Rule" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default GetRuleState;
