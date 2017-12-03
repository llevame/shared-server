import React, { Component } from 'react';
import Menu from './Menu';

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
				<Menu />
				<button type="button" onClick={this.onClick}>Log Out</button>
			</div>
		);
	}
}

export default LogOut;