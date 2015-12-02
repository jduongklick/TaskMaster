var TaskItem = React.createClass({
	getInitialState: function() {
		return {
			showDesc: false
		};
	},
	componentDidMount: function() {

		var component = this;
		component.setState({
			deadline: this.props.task.Deadline == null ? "--" : Util.absoluteDate(this.props.task.Deadline)
		});

		genome_api.getUser(this.props.task.AssigneeUserID)
		.then(function(data) {
			component.setState({
				userPhoto: {
					backgroundImage: "url('https://genome.klick.com"+ data.PhotoPath +"')"
				}
			});
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

		var display = this.props.visible ? "task-item card-item" : "task-item card-item is-hidden";
		var taskURL = "https://genome.klick.com/tickets/#/details/"+ this.props.task.TicketID;
		var taskChecklist = [];

		// Check to see if this task has any checklist items.
		if (this.props.task.ChecklistItems.length > 0) {
			this.props.task.ChecklistItems.forEach(function(item) {
				if (item.TicketStatusName == "open") {
					var assignedUser = item.AssignedToUserName != null ? item.AssignedToUserName : "Unassigned";
					taskChecklist.push(
						<TaskChecklistItem user={assignedUser} desc={item.Description} />
					);
				}
			});
		}

		return (
			<li className={display}>
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

						<ul className="task-checklist metadata">
							{taskChecklist}
						</ul>
					</div>
				</a>
			</li>
		);
	}
});
