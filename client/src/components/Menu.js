import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Menu extends Component {
	render() {
		return (
			<div>
				<ul className="List">
					<li>
						<Link to={'/'}>LogIn</Link>
					</li>
					<li style={{float: 'right'}}>
						<Link to={'/logOut'}>LogOut</Link>
					</li>
					<li style={{float: 'right'}}>
						<Link to={'/about'}>About</Link>
					</li>
					<li style={{float: 'right'}}>
						<Link to={'/contact'}>Contact</Link>
					</li>
					<li className="Dropdown">
						<a className="dropbtn">Business-Users</a>
						<div className="Dropdown-Content">
							<Link className="LinkD" to={'/business'}>Get all</Link>
							<Link className="LinkD" to={'/business-get'}>Get one</Link>
							<Link className="LinkD" to={'/business-add'}>Add one</Link>
							<Link className="LinkD" to={'/business-update'}>Update one</Link>
							<Link className="LinkD" to={'/business-del'}>Delete one</Link>
							<Link className="LinkD" to={'/business-me'}>Me</Link>
							<Link className="LinkD" to={'/business-update-me'}>Me - Update</Link>
						</div>
					</li>
					<li className="Dropdown">
						<a className="dropbtn">Servers</a>
						<div className="Dropdown-Content">
							<Link className="LinkD" to={'/servers'}>Get all</Link>
							<Link className="LinkD" to={'/servers-get'}>Get one</Link>
							<Link className="LinkD" to={'/servers-add'}>Add one</Link>
							<Link className="LinkD" to={'/servers-update'}>Update one</Link>
							<Link className="LinkD" to={'/servers-del'}>Delete one</Link>
							<Link className="LinkD" to={'/servers-status'}>Get status</Link>
							<Link className="LinkD" to={'/servers-stats'}>Get statistics</Link>
						</div>
					</li>
					<li className="Dropdown">
						<a className="dropbtn">Rules</a>
						<div className="Dropdown-Content">
							<Link className="LinkD" to={'/rules'}>Get all</Link>
							<Link className="LinkD" to={'/rules-get'}>Get one</Link>
							<Link className="LinkD" to={'/rules-add'}>Add one</Link>
							<Link className="LinkD" to={'/rules-run-test'}>Run tests</Link>
							<Link className="LinkD" to={'/rules-run'}>Run all</Link>
							<Link className="LinkD" to={'/rules-run-one'}>Run one</Link>
							<Link className="LinkD" to={'/rules-del'}>Delete one</Link>
							<Link className="LinkD" to={'/rules-update'}>Update one</Link>
						</div>
					</li>
					<li className="Dropdown">
						<a className="dropbtn">Trips</a>
						<div className="Dropdown-Content">
							<Link className="LinkD" to={'/trips'}>Get all</Link>
						</div>
					</li>
					<li className="Dropdown">
						<a className="dropbtn">Application Users</a>
						<div className="Dropdown-Content">
							<Link className="LinkD" to={'/app-users'}>Get all</Link>
						</div>
					</li>
				</ul>
			</div>
		);
	}
}

export default Menu;
