import React, { Component } from 'react';
import Menu from '../Menu';

class DeleteServer extends Component {

	constructor(props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
	}

	onDelete(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		let sid = e.target.id.value;
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/servers/' + sid + '?token=' + token, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((res) => {
				if (res.status === 204) {
					return {data: `Server with id: ${sid} has been erased succesfully!\n`};
				}
				return res.json();
			})
			.then((json) => {
				if (json.code) {
					alert(`An error has ocurred:\n\ncode: ${json.code}\nmessage: ${json.message}\n`);
				} else {
					alert(json.data);
				}
			});
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onDelete}>
					<input type="text" placeholder="Server Id" name="id" />
					<input type="submit" value="Delete" />
				</form>
			</div>
		);
	}
}

export default DeleteServer;