import React, { Component } from 'react';
import moment from 'moment';
import TableResults from '../TableResults';
import Menu from '../Menu';

class ServerStatus extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: [],
			hide: true,
		};
		this.onEnterToken = this.onEnterToken.bind(this);
	}

	onEnterToken(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/servers?token=' + token, {
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
					let now = moment().unix();
					let lastMinute = moment().subtract(5, 'minute').unix();
					json.servers = json.servers.map((s) => {
						return {
							id: s.id,
							name: s.name,
							status: (s.lastConnection >= lastMinute &&
									s.lastConnection < now) ? "ON" : "DOWN"
						};
					});
					this.setState({
						...this.state,
						result: json.servers,
						hide: false
					});
				}
			});
		}
	}

	renderResult() {

		if (!this.state.hide) {
			return (
				<TableResults result={this.state.result} style={{"justifyContent": "center"}}/>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onEnterToken}>
					<input type="submit" value="Get app-servers status" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default ServerStatus;