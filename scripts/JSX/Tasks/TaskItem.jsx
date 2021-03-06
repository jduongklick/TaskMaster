var TaskItem = React.createClass({
	getInitialState: function() {
		return {
		};
	},
	componentDidMount: function() {

		var component = this;
		component.setState({
			deadline: this.props.task.Deadline == null ? "--" : Util.absoluteDate(this.props.task.Deadline)
		});

		genome_api.getUser(this.props.task.AssigneeUserID)
		.then(function(data) {
			console.log(data.PhotoPath);
			component.setState({
				userPhoto: {
					backgroundImage: "url('https://genome.klick.com"+ data.PhotoPath +"')"
				},
			});

			// Get the user who last updated the ticket.
			return genome_api.getUser(component.props.task.UpdaterUserID);
		})
		.then(function(data) {
			component.setState({
				updatedUserName: data.FirstName +" "+ data.LastName
			})
		});
	},
	onTaskItemClicked: function(event) {
    	window.location.hash = "#/task/"+ this.props.task.TicketID;
  	},
	render: function() {
		var taskURL = "https://genome.klick.com/tickets/#/details/"+ this.props.task.TicketID;
		var taskChecklist;

		// Check to see if this task has any checklist items.
		if (this.props.task.ChecklistItems.length > 0) {
			taskChecklist = <TaskSubitem subtasks={this.props.task.ChecklistItems} />
		}

		return (
			<li className={"task-item card-item animated fadeInDown"} data-task-id={this.props.task.TicketID}>
				<a href={taskURL} target="_blank" className="task-link">
					<div className="card-photo-container">
						<div className="photo" style={this.state.userPhoto}></div>
						<div className="photo-of task-user">{this.props.task.AssigneeUserFullName}</div>
					</div>
					<div className="card-content-container">
						<h2 className="heading">{this.props.task.Title}</h2>
						<div className="task-portfolio metadata">Status: {this.props.task.TicketStatusName}</div>
						<div className="task-updated metadata">Last updated: {Util.absoluteDate(this.props.task.Updated)} by {this.state.updatedUserName}</div>
						<div className="task-deadline metadata">Deadline: {this.state.deadline}</div>
						<div className="task-id metadata">{this.props.task.TicketID}</div>
					</div>
					{taskChecklist}
				</a>
			</li>
		);
	}
});
