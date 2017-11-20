import React, { Component } from 'react';
import Menu from './Menu';

class Contact extends Component {

	render() {
		return (
			<div>
				<Menu />
				<h2>Collaborators</h2>
				<h4>Mauro Toscano - @MauroFab</h4>
				<h4>Patricio Iribarne Catella - @PatricioIribarneCatella</h4>
				<h4>Lucía Capón Paul - @luciaCP</h4>
				<h4>Nicolás Alvarez - @nicolasgalvarez91</h4>
				<h4>Nicolás Pablo Fernandez Theillet - @npfernandeztheillet</h4>
			</div>
		);
	}
}

export default Contact;