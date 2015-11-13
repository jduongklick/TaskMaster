var TaskItem = React.createClass({
	getInitialState: function() {
		return {
			showDesc: false
		};
	},
	onTaskItemClicked: function(event) {
    	window.location.hash = "#/task/"+ this.props.task.TicketID;
  	},
	render: function() {

		return (
			<li className="task-item card-item" onClick={this.onTaskItemClicked}>
				<h2 className="title">{this.props.task.Title}</h2>
				<div className="metadata">
					<div className="task-id">{this.props.task.TicketID}</div>
					<div className="task-portfolio">{this.props.task.AccountPortfolioName}</div>
					<div className="task-project">{this.props.task.ProjectName}</div>
				</div>
			</li>
		);

	}
});
