import React, { Component } from 'react';
import Menu from './Menu';

class Contact extends Component {
	render() {
		return (
			<div>
				<Menu />
				<div style={{ textAlign: 'center' }}>
					<h2>Collaborators</h2>
					<a
						className="Info"
						href="https://github.com/MauroFab"
						target="_blank"
						rel="noopener noreferrer"
					>
						Mauro Toscano
					</a>
					<br />
					<br />
					<a
						className="Info"
						href="https://github.com/PatricioIribarneCatella"
						target="_blank"
						rel="noopener noreferrer"
					>
						Patricio Iribarne Catella
					</a>
					<br />
					<br />
					<a
						className="Info"
						href="https://github.com/luciaCP"
						target="_blank"
						rel="noopener noreferrer"
					>
						Lucía Capón Paul
					</a>
					<br />
					<br />
					<a
						className="Info"
						href="https://github.com/nicolasgalvarez91"
						target="_blank"
						rel="noopener noreferrer"
					>
						Nicolás Alvarez
					</a>
					<br />
					<br />
					<a
						className="Info"
						href="https://github.com/npfernandeztheillet"
						target="_blank"
						rel="noopener noreferrer"
					>
						Nicolás Pablo Fernandez Theillet
					</a>
				</div>
			</div>
		);
	}
}

export default Contact;
