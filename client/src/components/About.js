import React, { Component } from 'react';
import Menu from './Menu';

class About extends Component {
	render() {
		return (
			<div>
				<Menu />
				<div style={{ textAlign: 'center' }}>
					<h2>Llevame backoffice. Hosted in GitHub</h2>
					<a
						className="Info"
						href="https://github.com/llevame"
						target="_blank"
						rel="noopener noreferrer"
					>
						Go to the project
					</a>
				</div>
			</div>
		);
	}
}

export default About;
