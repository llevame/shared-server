import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import Menu from '../Menu';

class GetBusinessUsers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: [],
			hide: true,
		};
		this.onGetUsers = this.onGetUsers.bind(this);
	}

	onGetUsers(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/business-users?token=' + token, {
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
						result: json.businessUser,
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
				<form className="Form" onSubmit={this.onGetUsers}>
					<input type="submit" value="Get business users" />
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default GetBusinessUsers;