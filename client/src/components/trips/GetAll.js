import React, { Component } from 'react';
import TableResults from '../TableResults';
import Menu from '../Menu';

class GetTrips extends Component {
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
			fetch('/api/trips?token=' + token, {
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
							result: json.trips,
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
					style={{ justifyContent: 'left' }}
				/>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onEnterToken}>
					<input type="submit" value="Get trips" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default GetTrips;
