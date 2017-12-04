import React, { Component } from 'react';
import TableResults from '../TableResults';
import Menu from '../Menu';

class GetRuleCommits extends Component {
	constructor(props) {
		super(props);
		this.state = {
			result: [],
			hide: true,
		};
		this.onGetCommits = this.onGetCommits.bind(this);
	}

	onGetCommits(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/rules/' + e.target.id.value + '/commits?token=' + token, {
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
						hide: true,
					});
					alert(
						`An error has ocurred:\n\ncode: ${
							json.code
						}\nmessage: ${json.message}\n`
					);
				} else {
					this.setState({
						...this.state,
						result: json.commits,
						hide: false,
					});
				}
			});
		}
	}

	renderResult() {
		if (!this.state.hide) {
			return (
				<TableResults
					result={this.state.result}
					style={{ justifyContent: 'center' }}
				/>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onGetCommits}>
					<input type="text" placeholder="Rule Id" name="id" />
					<input type="submit" value="Get commits" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default GetRuleCommits;
