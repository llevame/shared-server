import React, { Component } from 'react';
import JSONViewer from 'react-json-viewer';

class TableResults extends Component {
	constructor(props) {
		super(props);
		this.state = {
			justify: this.props.style,
			result: this.props.result,
		};
	}

	render() {
		return (
			<div className="OutsideTable">
				<div className="TableResults" style={this.state.justify}>
					<JSONViewer json={this.state.result} />
				</div>
			</div>
		);
	}
}

export default TableResults;
