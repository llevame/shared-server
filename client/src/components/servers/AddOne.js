import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import moment from 'moment';
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
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default AddServer;