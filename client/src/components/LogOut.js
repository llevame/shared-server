import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class LogOut extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		if (sessionStorage.getItem('token') !== null) {
			sessionStorage.removeItem('token');
			alert('Log Out successfull');
		} else {
			alert('You are already Log Out!!');
		}
	}

	render() {
		return (
			<div>
				{this.onClick()}
				<Redirect to="/" />
			</div>
		);
	}
}

export default LogOut;
