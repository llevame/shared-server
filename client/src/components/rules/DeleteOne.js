import React, { Component } from 'react';
import Menu from '../Menu';

class DeleteRule extends Component {
	constructor(props) {
		super(props);
		this.onDelete = this.onDelete.bind(this);
	}

	onDelete(e) {
		e.preventDefault();
		let token = sessionStorage.getItem('token');
		let rid = e.target.id.value;
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/rules/' + rid + '?token=' + token, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then(res => {
					if (res.status === 204) {
						return {
							data: `Rule with id: ${
								rid
							} has been succesfully deactivated!\n`,
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
					<input type="text" placeholder="Rule Id" name="id" />
					<input type="submit" value="Delete" />
				</form>
			</div>
		);
	}
}

export default DeleteRule;
