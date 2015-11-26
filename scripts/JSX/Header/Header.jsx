var Header = React.createClass({
	getInitialState: function() {
		return {
			history: 0,
			title: ""
		};
	},
	componentDidMount: function() {

	},
	onBackSelect: function() {
		window.history.back();
	},
	onFowardSelect: function() {
		window.history.forward();
	},
	render: function() {

		var msgBack = this.props.state.state > 1 ? "Back" : " ";
		var msgForward = this.props.state.state < 3 ? "Forward" : " ";

		return (
			<div className="header-component">
				<div className="btn-back nav-btns" onClick={this.onBackSelect}>{msgBack}</div>
				<div className="header-title">Project Name</div>
				<div className="btn-forward nav-btns" onClick={this.onFowardSelect}></div>
			</div>
		);
	}
});
