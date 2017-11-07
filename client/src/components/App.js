import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Contact from './Contact';
import About from './About';
import LogIn from './LogIn';
import GetBusinessUsers from './business-users/GetAll';
import GetOneBusinessUser from './business-users/GetOne';
import AddBusinessUser from './business-users/AddOne';

import logo from '../carretera.jpg';
import '../css/App.css';

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
					<Route path="/business" component={ GetBusinessUsers } />
					<Route path="/business-add" component={ AddBusinessUser } />
					<Route path="/business-get" component={ GetOneBusinessUser } />
				</Switch>
			</div>
		);
	}
}

export default App;
