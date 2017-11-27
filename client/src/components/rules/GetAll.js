import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import TableResults from '../TableResults';
import Menu from '../Menu';

class GetRules extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: [],
			hide: true,
		};
		this.onGetAll = this.onGetAll.bind(this);
	}

	onGetAll(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/rules?token=' + token, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
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
						result: json.rules,
						hide: false
					});
				}
			});
		}
	}

	renderResult() {

		if (!this.state.hide) {

			let rules = this.state.result.map((r) => {
				return {
					information: {
						id: r.id,
						_ref: r._ref,
						language: r.language,
						active: r.active,
						lastCommit: r.lastCommit
					},
					blob: r.blob
				};
			});

			return (
				<div>
					{rules.map((rule) => 
						<div>
							<h4>Information:</h4>
							<TableResults result={rule.information} style={{"justifyContent": "left"}}/>
							<h4>Rule:</h4>
							<CodeMirror value={rule.blob} options={{...this.config, readOnly: true}}/>
						</div>
					)}
				</div>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onGetAll}>
					<input type="submit" value="Get rules" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default GetRules;