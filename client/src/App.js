import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import logo from './carretera.jpg';
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		this.getUsers();
	}

	getUsers() {
		fetch('/api/users')
			.then(res => res.json())
			.then(users => this.setState({users}));
	}

	render() {

		const {users} = this.state;

		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Bienvenido a Llevame</h2>
				</div>
				<p className="App-intro">
					Listado de usuarios
				</p>
				<JSONTree data={users} />
			</div>
		);
	}
}

export default App;
