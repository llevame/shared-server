import React, { Component } from 'react';
import moment from 'moment';
import TableResults from '../TableResults';
import Menu from '../Menu';

class AddServer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectValue: 'admin',
			result: {},
			hide: true
		};
		this.onAddServer = this.onAddServer.bind(this);
	}

	onAddServer(e) {
		e.preventDefault();
		let credentials = {
			name: e.target.name.value,
			createdBy: e.target.createdBy.value,
			createdTime: moment().unix()
		};
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/servers?token=' + token, {
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
						result: json.server,
						hide: false
					});
				}
			});
		}
	}

	renderResult() {

		if (!this.state.hide) {
			return (
				<TableResults result={this.state.result} style={{"justify-content": "left"}}/>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onAddServer}>
					<input type="text" placeholder="Name" name="name" />
					<br />
					<input type="text" placeholder="Creator" name="createdBy" />
					<br />
					<input type="submit" value="Add" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default AddServer;