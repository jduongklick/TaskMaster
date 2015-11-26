var TaskList = React.createClass({
	getInitialState: function(){
		return {
			tasks: [],
			assignedUsers: [],		
			assignedUsersIDs: [],		
			currentUser: 0,
			currentProjectName: "",
			filterUser: 0,
			isFiltered: false
		};
	},
	componentDidMount: function() {

		var component = this;
		var projectID = window.location.hash.replace(/^#\/?|\/$/g, '').split('/')[1];

		// Get project tasks.
		genome_api.getProjectTasks(projectID).then(function(data) {
			component.setState({
				tasks: data.Entries
			});

			// Get a list of current assigned users.
			data.Entries.forEach(function(task) {

				// Check for duplicates.
				if (component.state.assignedUsersIDs.indexOf(task.AssigneeUserID) < 0) {
					component.state.assignedUsersIDs.push(task.AssigneeUserID);
					component.state.assignedUsers.push({
						id: task.AssigneeUserID,
						userName: task.AssigneeUserFullName
					});
				}
			});

			return genome_api.getCurrentUser();
		})
		.then(function(data) {
			component.setState({
				currentUser: data
			});

			return genome_api.getProjectDetails(projectID)
		})
		.then(function(data) {
			component.setState({
				currentProjectName: data.Entries[0].CoreName
			});
		});
	},
	filterByUser: function(ev) {
		if (ev.target.value > 0) {
			//console.log("ev.target.value: "+ ev.target.value)
			this.setState({
				filterUser: ev.target.value,
				isFiltered: true
			});
		}

		else {
			this.setState({
				filterUser: 0,
				isFiltered: false
			});
		}
	},
	render: function() {

		var projectTasks = [];
		var component = this;

		// Push each task into the array.
		this.state.tasks.forEach(function(task) {
			//console.log(task.AssigneeUserID);
			var isVisible = true;

			if (component.state.isFiltered) 
				isVisible = (task.AssigneeUserID == component.state.filterUser) ? true : false;
			
			projectTasks.push(
				<TaskItem task={task} visible={isVisible} />
			);
		}.bind(this));

		return (
			<div className="task-list-container view-container">
				<TaskHeader projectName={this.state.currentProjectName} />
				<ul className="task-list card-list-view">
					{projectTasks}
				</ul>
				<TaskListFilter users={this.state.assignedUsers} onUserFiltered={this.filterByUser} />
			</div>

		);

	}
});
