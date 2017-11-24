import React, { Component } from 'react';
import TableResults from '../TableResults';
import Menu from '../Menu';

class AddBusinessUser extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectValue: 'admin',
			result: {},
			hide: true
		};
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.onAddUser = this.onAddUser.bind(this);
	}

	handleSelectChange(e) {
		this.setState({
			...this.state,
			selectValue: e.target.value
		});
	}

	onAddUser(e) {
		e.preventDefault();
		let credentials = {
			username: e.target.username.value,
			password: e.target.password.value,
			name: e.target.name.value,
			surname: e.target.surname.value,
			roles: [this.state.selectValue]
		};
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/business-users?token=' + token, {
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
						result: json.businessUser,
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
				<form className="Form" onSubmit={this.onAddUser}>
					<input type="text" placeholder="Username" name="username" />
					<br />
					<input type="password" placeholder="Password" name="password" />
					<br />
					<input type="text" placeholder="Name" name="name" />
					<br />
					<input type="text" placeholder="Surname" name="surname" />
					<br /><br />
					<label>
						Select a role:
						<select value={this.state.selectValue} onChange={this.handleSelectChange}>
							<option value="admin">Admin</option>
							<option value="manager">Manager</option>
							<option value="user">User</option>
						</select>
					</label>
					<br /><br />
					<input type="submit" value="Add" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default AddBusinessUser;