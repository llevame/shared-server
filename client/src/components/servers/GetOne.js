import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import Menu from '../Menu';

class GetOneServer extends Component {

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
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/servers/' + e.target.id.value + '?token=' + token, {
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
				<form className="Form" onSubmit={this.onGet}>
					<input type="text" placeholder="Server Id" name="id" />
					<input type="submit" value="Get" />
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default GetOneServer;