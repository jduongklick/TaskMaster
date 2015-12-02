var TaskChecklistItem = React.createClass({
	render: function() {
		return (
			<li className="checklist-item">
				<div className="checklist-user">{this.props.user}</div>
				<div className="checklist-description">{this.props.desc}</div>
			</li>
		);
	}
});
