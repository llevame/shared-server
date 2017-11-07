import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import Menu from '../Menu';

class UpdateMyInformation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: {},
			hide: true
		};
		this.onUpdateUser = this.onUpdateUser.bind(this);
	}

	onUpdateUser(e) {
		e.preventDefault();
		let credentials = {
			_ref: e.target._ref.value,
			username: e.target.username.value,
			password: e.target.password.value,
			name: e.target.name.value,
			surname: e.target.surname.value,
		};
		fetch('/api/business-users/me?token=' + e.target.token.value, {
			method: 'PUT',
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
					result: json.businessUser,
					hide: false
				});
			}
		});
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onUpdateUser}>
					<input type="text" placeholder="Token" name="token" />
					<br /><br />
					<input type="text" placeholder="Revision Code" name="_ref" />
					<br />
					<input type="text" placeholder="Username" name="username" />
					<br />
					<input type="password" placeholder="Password" name="password" />
					<br />
					<input type="text" placeholder="Name" name="name" />
					<br />
					<input type="text" placeholder="Surname" name="surname" />
					<br />
					<input type="submit" value="Update" />
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default UpdateMyInformation;