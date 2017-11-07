import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import Menu from '../Menu';

class GetOneBusinessUser extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: {},
			hide: true,
		};
		this.onGet = this.onGet.bind(this);
	}

	onGet(e) {
		e.preventDefault();
		fetch('/api/business-users/' + e.target.id.value + '?token=' + e.target.token.value, {
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

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onGet}>
					<input type="text" placeholder="Token" name="token" />
					<br /><br />
					<input type="text" placeholder="User Id" name="id" />
					<input type="submit" value="Get" />
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default GetOneBusinessUser;