import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import JSONTree from 'react-json-tree';

import logo from './carretera.jpg';
import './App.css';

class Menu extends Component {

	render() {
		return (
			<div>
				<ul className="List">
					<li>
						<Link to={'/'}>LogIn</Link>
					</li>
					<li>
						<Link to={'/about'}>About</Link>
					</li>
					<li>
						<Link to={'/contact'}>Contact</Link>
					</li>
					<li>
						<Link to={'/business'}>Business-Users</Link>
					</li>
				</ul>
			</div>
		);
	}
}

class BusinessMenu extends Component {

	render() {
		return (
			<div>
				<ul className="SubList">
					<li>
						<Link to={'/business'}>Get all</Link>
					</li>
					<li>
						<Link to={'/business'}>Add one</Link>
					</li>
					<li>
						<Link to={'business/:userId'}>Get one</Link>
					</li>
				</ul>
			</div>
		);
	}
}

class LogIn extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: 'Your new token is: '
		};
	}

	onLogIn(e) {
		e.preventDefault();
		let credentials = {
			username: e.target.username.value,
			password: e.target.password.value
		}
		fetch('/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials)
		})
		.then((res) => res.json())
		.then((json) => {
			if (json.code) {
				this.setState({
					...this.state,
					result: 'Your new token is: ',
				});
				alert(`An error has ocurred:\n\ncode: ${json.code}\nmessage: ${json.message}\n`);
			} else {
				this.setState({
					...this.state,
					result: 'Your new token is: ' + json.token.token,
				});
			}
		})
		.catch((err) => console.log(err));
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onLogIn.bind(this)}>
					<input type="text" placeholder="Username" name="username" />
					<input type="password" placeholder="Password" name="password" />
					<input type="submit" value="Log In" />
				</form>
				<h4 className="TokenResult">{this.state.result}</h4>
			</div>
		);
	}
}

class GetBusinessUsers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			result: []
		};
	}

	onEnterToken(e) {
		e.preventDefault();
		fetch('/api/business-users?token=' + e.target.token.value, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((res) => res.json())
		.then((json) => {
			this.setState({
				...this.state,
				result: json.businessUser,
			});
		});
	}

	render() {
		return (
			<div>
				<BusinessMenu />
				<form className="Form" onSubmit={this.onEnterToken.bind(this)}>
					<h4>Enter your token</h4>
					<input type="text" placeholder="Token" name="token" />
					<input type="submit" value="Get business users" />
				</form>
				<JSONTree hideRoot={this.state.result.length <= 0} data={this.state.result} />
			</div>
		);
	}
}

class BusinessUsers extends Component {

	render() {
		return (
			<div>
				<Switch>
					<Route exact path="/business" component={ GetBusinessUsers } />
				</Switch>
			</div>
		);
	}
}

class About extends Component {

	render() {
		return (
			<div>
				<Menu />
				<h2>Llevame backoffice. Hosted in GitHub</h2>
				<h3>https://github.com/llevame</h3>
			</div>
		);
	}
}

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

class App extends Component {

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h2>Bienvenido a Llevame</h2>
				</div>
				<Switch>
					<Route exact path="/" component={ LogIn } />
					<Route path="/about" component={ About } />
					<Route path="/contact" component={ Contact } />
					<Route path="/business" component={ BusinessUsers } />
				</Switch>
			</div>
		);
	}
}

export default App;
