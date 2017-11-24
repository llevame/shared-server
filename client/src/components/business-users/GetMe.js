import React, { Component } from 'react';
import TableResults from '../TableResults';
import Menu from '../Menu';

class GetMyInformation extends Component {

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
			fetch('/api/business-users/me?token=' + token, {
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

	renderResult() {

		if (!this.state.hide) {
			return (
				<TableResults result={this.state.result} style={{"justify-content": "center"}}/>
			);
		}
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onGet}>
					<input type="submit" value="Get" />
				</form>
				{this.renderResult()}
			</div>
		);
	}
}

export default GetMyInformation;