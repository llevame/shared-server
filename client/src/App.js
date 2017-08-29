import React, { Component } from 'react';
import './App.css';

class App extends Component {

	// Initialize state
	state = {};

	componentDidMount() {
		fetch('/api')
			.then(res => res.json())
	}

	render() {
		return (
			<div className="App">
				<h1>Shared-Server</h1>
			</div>
		);
	}
}

export default App;
