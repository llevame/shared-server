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
					<li>
						<Link to={'/about'}>About</Link>
					</li>
					<li>
						<Link to={'/contact'}>Contact</Link>
					</li>
					<li>
						Business-Users
						<ul>
							<li>
								<Link to={'/business'}>Get all</Link>
							</li>
							<li>
								<Link to={'/business-get'}>Get one</Link>
							</li>
							<li>
								<Link to={'/business-add'}>Add one</Link>
							</li>
							<li>
								<Link to={'/business-update'}>Update one</Link>
							</li>
							<li>
								<Link to={'/business-del'}>Delete one</Link>
							</li>
							<li>
								<Link to={'/business-me'}>
									Get my information
								</Link>
							</li>
							<li>
								<Link to={'/business-update-me'}>
									Update my information
								</Link>
							</li>
						</ul>
					</li>
					<li>
						Servers
						<ul>
							<li>
								<Link to={'/servers'}>Get all</Link>
							</li>
							<li>
								<Link to={'/servers-get'}>Get one</Link>
							</li>
							<li>
								<Link to={'/servers-add'}>Add one</Link>
							</li>
							<li>
								<Link to={'/servers-update'}>Update one</Link>
							</li>
							<li>
								<Link to={'/servers-del'}>Delete one</Link>
							</li>
							<li>
								<Link to={'/servers-status'}>Get status</Link>
							</li>
							<li>
								<Link to={'/servers-stats'}>
									Get statistics
								</Link>
							</li>
						</ul>
					</li>
					<li>
						Rules
						<ul>
							<li>
								<Link to={'/rules'}>Get all</Link>
							</li>
							<li>
								<Link to={'/rules-get'}>Get one</Link>
							</li>
							<li>
								<Link to={'/rules-add'}>Add one</Link>
							</li>
							<li>
								<Link to={'/rules-run-test'}>Run tests</Link>
							</li>
							<li>
								<Link to={'/rules-run'}>Run all</Link>
							</li>
							<li>
								<Link to={'/rules-run-one'}>Run one</Link>
							</li>
							<li>
								<Link to={'/rules-del'}>Delete one</Link>
							</li>
							<li>
								<Link to={'/rules-update'}>Update one</Link>
							</li>
						</ul>
					</li>
					<li>
						Trips
						<ul>
							<li>
								<Link to={'/trips'}>Get all</Link>
							</li>
						</ul>
					</li>
					<li>
						Application Users
						<ul>
							<li>
								<Link to={'/app-users'}>Get all</Link>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		);
	}
}

export default Menu;
