import React, { Component } from 'react';
import TableResults from '../TableResults';
import Menu from '../Menu';

class UpdateServer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			result: {},
			hide: true,
		};
		this.onUpdateServer = this.onUpdateServer.bind(this);
	}

	onUpdateServer(e) {
		e.preventDefault();
		let credentials = {
			_ref: e.target._ref.value,
			name: e.target.name.value,
		};
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/servers/' + e.target.id.value + '?token=' + token, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
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
							result: json.server,
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
				<form className="Form" onSubmit={this.onUpdateServer}>
					<input type="text" placeholder="Server Id" name="id" />
					<br />
					<br />
					<input type="text" placeholder="Revison Code" name="_ref" />
					<br />
					<input type="text" placeholder="Name" name="name" />
					<br />
					<br />
					<input type="submit" value="Update" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default UpdateServer;
