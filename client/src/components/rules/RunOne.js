import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import Menu from '../Menu';

class RunOneRule extends Component {

	constructor(props) {
		super(props);
		this.state = {
			facts: "",
			result: {},
			hide: true,
		};
		this.config = {
			mode: 'javascript',
			lineNumbers: true,
			tabSize: 2,
			identWithTabs: true
		};
		this.onRunRule = this.onRunRule.bind(this);
		this.setFacts = this.setFacts.bind(this);
	}

	setFacts(text) {
		this.setState({
			...this.state,
			facts: text,
		});
	}

	onRunRule(e) {
		// send the facts to the server
	}

	render() {
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onRunRule}>
					<input type="text" placeholder="Token" name="token" />
					<br /><br />
					<input type="submit" value="Run" />
					<h4>Facts:</h4>
					<CodeMirror options={this.config} onChange={this.setFacts}/>
				</form>
				<JSONTree hideRoot={this.state.hide} data={this.state.result} />
			</div>
		);
	}
}

export default RunOneRule;