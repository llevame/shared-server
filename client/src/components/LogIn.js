import React, { Component } from 'react';
import Menu from './Menu';

class LogIn extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: 'Your new token is: '
		};
	}

	onLogIn(e) {
		e.preventDefault();
		let credentials = {
			username: e.target.username.value,
			password: e.target.password.value
		}
		fetch('/api/token', {
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
					result: 'Your new token is: ',
				});
				alert(`An error has ocurred:\n\ncode: ${json.code}\nmessage: ${json.message}\n`);
			} else {
				this.setState({
					...this.state,
					result: 'Your new token is: ' + json.token.token,
				});
			}
		})
		.catch((err) => console.log(err));
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onLogIn.bind(this)}>
					<input type="text" placeholder="Username" name="username" />
					<input type="password" placeholder="Password" name="password" />
					<input type="submit" value="Log In" />
				</form>
				<h4 className="TokenResult">{this.state.result}</h4>
			</div>
		);
	}
}

export default LogIn;