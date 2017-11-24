import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Contact from './Contact';
import About from './About';
import LogIn from './LogIn';

import GetBusinessUsers from './business-users/GetAll';
import GetOneBusinessUser from './business-users/GetOne';
import AddBusinessUser from './business-users/AddOne';
import UpdateBusinessUser from './business-users/UpdateOne';
import DeleteBusinessUser from './business-users/DeleteOne';
import GetMyInformation from './business-users/GetMe'
import UpdateMyInformation from './business-users/UpdateMe'

import GetServers from './servers/GetAll';
import GetOneServer from './servers/GetOne';
import AddServer from './servers/AddOne';
import UpdateServer from './servers/UpdateOne';
import DeleteServer from './servers/DeleteOne';

import GetRules from './rules/GetAll';
import GetOneRule from './rules/GetOne';
import AddRule from './rules/AddOne';
import RunTestRules from './rules/RunTests'
import RunOneRule from './rules/RunOne';
import RunAllRules from './rules/RunAll';
import DeleteRule from './rules/DeleteOne';
import UpdateRule from './rules/UpdateOne';

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
				<div className="App-Routes">
					<Switch>
						<Route exact path="/" component={ LogIn } />
						<Route path="/about" component={ About } />
						<Route path="/contact" component={ Contact } />
						<Route path="/business" component={ GetBusinessUsers } />
						<Route path="/business-add" component={ AddBusinessUser } />
						<Route path="/business-get" component={ GetOneBusinessUser } />
						<Route path="/business-update" component={ UpdateBusinessUser } />
						<Route path="/business-del" component={ DeleteBusinessUser } />
						<Route path="/business-me" component={ GetMyInformation } />
						<Route path="/business-update-me" component={ UpdateMyInformation } />
						<Route path="/servers" component={ GetServers } />
						<Route path="/servers-add" component={ AddServer } />
						<Route path="/servers-get" component={ GetOneServer } />
						<Route path="/servers-update" component={ UpdateServer } />
						<Route path="/servers-del" component={ DeleteServer } />
						<Route path="/rules" component={ GetRules } />
						<Route path="/rules-get" component={ GetOneRule } />
						<Route path="/rules-add" component={ AddRule } />
						<Route path="/rules-run-test" component={ RunTestRules } />
						<Route path="/rules-run" component={ RunAllRules } />
						<Route path="/rules-run-one" component={ RunOneRule } />
						<Route path="/rules-del" component={ DeleteRule } />
						<Route path="/rules-update" component={ UpdateRule } />
					</Switch>
				</div>
			</div>
		);
	}
}

export default App;
