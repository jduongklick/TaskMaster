var TaskList = React.createClass({
	getInitialState: function(){
		return {
			tasks: [],
			assignedUsers: [],	
			assignedUsersIDs: [],
			currentUser: "",
			currentProjectName: "",
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

				// Check for checklist items if any.
				if (task.ChecklistItems.length > 0) {
					task.ChecklistItems.forEach(function(item) {
						// Check to see if user is in the list.
						if (item.AssignedToUserID != null && component.state.assignedUsersIDs.indexOf(item.AssignedToUserID) < 0) {
							component.state.assignedUsersIDs.push(item.AssignedToUserID);
							component.state.assignedUsers.push({
								id: item.AssignedToUserID,
								userName: item.AssignedToUserName
							});
						}

					});
					
				}
			});

			return genome_api.getCurrentUser();
		})
		.then(function(data) {
			// Set filter user to be the current user. 
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
	searchCheckListItems: function(list,userID) {
		
		var userExist = false;

		list.forEach(function(item) {
			if (item.AssignedToUserID == userID)
				userExist = true;
		});

		return userExist;

	},
	render: function() {
		var projectTasks = [];
		var component = this;

		// Push each task into the array.
		this.state.tasks.forEach(function(task) {
			// Only render items that are assigned to the user.
			if (component.searchCheckListItems(task.ChecklistItems,component.state.currentUser) || component.state.currentUser == task.AssigneeUserID) {
				projectTasks.push(
					<TaskItem task={task} currentUser={component.state.currentUser} />
				);
			}
		}.bind(this));

		return (
			<div className="task-list-container view-container">
				<TaskHeader projectName={this.state.currentProjectName} />
				<ul className="task-list card-list-view">
					{projectTasks}
				</ul>
				<TaskListFilter
					filterUser={this.state.filterUser}
					users={this.state.assignedUsers}
					onUserFiltered={this.filterByUser}
					onNameFiltered={this.filterByName} />
			</div>

		);

	}
});
