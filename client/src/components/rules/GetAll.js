import React, { Component } from 'react';
import JSONView from 'react-json-view';
import Menu from '../Menu';
import Serial from '../../utils/Serial';

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
					let r = json.rules.map((rule) => {
						rule.blob = Serial.deserialize(rule.blob);
						return rule;
					});
					this.setState({
						...this.state,
						result: r,
						hide: false
					});
				}
			});
		}
	}

	renderResult() {

		if (!this.state.hide) {

			return (
				<JSONView src={this.state.result} name="rules" theme="monokai"/>
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