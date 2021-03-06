import React, { Component } from 'react';
import moment from 'moment';
import TableResults from '../TableResults';
import Menu from '../Menu';

class ServerStatistics extends Component {
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
		let now = moment().unix();
		let lastHour = moment()
			.subtract(1, 'hour')
			.unix();
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch(
				'/api/stats?startTime=' +
					lastHour +
					'&endTime=' +
					now +
					'&token=' +
					token,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
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
							result: json.serversStatistics,
							hide: false,
						});
					}
				});
		}
	}

	renderStatistics() {
		return this.state.result.length > 0 ? (
			<TableResults
				result={this.state.result}
				style={{ justifyContent: 'center' }}
			/>
		) : (
			<h4 style={{ textAlign: 'center' }}>No recent statistics yet</h4>
		);
	}

	renderResult() {
		if (!this.state.hide) {
			return (
				<div>
					<h3 style={{ textAlign: 'center' }}>
						Statistics in the last hour
					</h3>
					{this.renderStatistics()}
				</div>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onEnterToken}>
					<input type="submit" value="Get app-servers statistics" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default ServerStatistics;
