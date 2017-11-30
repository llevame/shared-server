import React, { Component } from 'react';
import Menu from '../Menu';

class DeleteBusinessUser extends Component {
	constructor(props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
	}

	onDelete(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		let bid = e.target.id.value;
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/business-users/' + bid + '?token=' + token, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(res => {
					if (res.status === 204) {
						return {
							data: `Business user with id: ${
								bid
							} has been erased succesfully!\n`,
						};
					}
					return res.json();
				})
				.then(json => {
					if (json.code) {
						alert(
							`An error has ocurred:\n\ncode: ${
								json.code
							}\nmessage: ${json.message}\n`
						);
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
					<input type="text" placeholder="User Id" name="id" />
					<input type="submit" value="Delete" />
				</form>
			</div>
		);
	}
}

export default DeleteBusinessUser;
