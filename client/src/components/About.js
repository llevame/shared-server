import React, { Component } from 'react';
import Menu from './Menu';

class About extends Component {

	render() {
		return (
			<div>
				<Menu />
				<div style={{"textAlign": "center"}}>
					<h2>Llevame backoffice. Hosted in GitHub</h2>
					<h3>https://github.com/llevame</h3>
				</div>
			</div>
		);
	}
}

export default About;