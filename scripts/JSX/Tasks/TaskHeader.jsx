var TaskHeader = React.createClass({
	getInitialState: function() {
		return {
			title: ""
		};
	},
	onBackSelect: function() {
		window.history.back();
	},
	render: function() {
		return (
			<div className="header-component">
				<div className="btn-back nav-btns" onClick={this.onBackSelect}>Back</div>
				<div className="header-title">{this.props.projectName}</div>
			</div>
		);
	}
});
