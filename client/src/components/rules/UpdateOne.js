import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import Serial from '../../utils/Serial';
import Menu from '../Menu';

class UpdateRule extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectValue: 'true',
			rule: "",
		};
		this.config = {
			mode: 'javascript',
			lineNumbers: true,
			tabSize: 2,
			identWithTabs: true
		};
		this.setRule = this.setRule.bind(this);
		this.onUpdateRule = this.onUpdateRule.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
	}

	setRule(text) {
		this.setState({
			...this.state,
			rule: text,
		});
	}

	handleSelectChange(e) {
		this.setState({
			...this.state,
			selectValue: e.target.value
		});
	}

	onUpdateRule(e) {
		e.preventDefault();
		let credentials = {
			_ref: e.target._ref.value,
			language: 'node-rules/javascript',
			blob: this.state.rule,
			active: (this.state.selectValue === 'true'),
		};
		let token = sessionStorage.getItem('token');
		if (token == null) {
			alert('You must be logged in');
		} else {
			fetch('/api/rules/' + e.target.id.value + '?token=' + token, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials)
			})
			.then((res) => res.json())
			.then((json) => {
				if (json.code) {
					alert(`An error has ocurred:\n\ncode: ${json.code}\nmessage: ${json.message}\n`);
				} else {
					alert(`Rule has been successfully updated`);
				}
			});
		}
	}

	render() {
		let r = "Ej: add this rule\n" + Serial.serialize({
			condition: function (R) {
				R.when(this && (this.transactionTotal < 500));
			},
			consequence: function (R) {
				this.result = false;
				R.stop();
			}
		}, {space: 2});
		return (
			<div>
				<Menu />
				<form className="Form" onSubmit={this.onUpdateRule}>
					<input type="text" placeholder="Rule Id" name="id" />
					<br /><br />
					<input type="text" placeholder="Revision Code" name="_ref" />
					<br /><br />
					<label>
						Select a status:
						<select value={this.state.selectValue} onChange={this.handleSelectChange}>
							<option value="true">Active</option>
							<option value="false">Inactive</option>
						</select>
					</label>
					<br />
					<h4>Rule:</h4>
					<CodeMirror value={r} options={this.config} onChange={this.setRule}/>
					<input type="submit" value="Update" />
				</form>
			</div>
		);
	}
}

export default UpdateRule;