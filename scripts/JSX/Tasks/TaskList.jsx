var TaskList = React.createClass({
	getInitialState: function(){
		return {
			tasks: [],
			assignedUsers: [],		
			assignedUsersIDs: [],		
			currentUser: 0,
			currentProjectName: "",
			filterUser: 0,
			filterName: "",
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
			component.setState({
				currentUser: data,
				filterUser: data,
				isFiltered: true
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
	filterByName: function(ev) {

		if (ev.target.value.length < 2)
			return;

		console.log(".....");
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
			//console.log(task);
			var isVisible = true;

			if (component.state.isFiltered) 
				isVisible = (task.AssigneeUserID == component.state.filterUser || ( task.ChecklistItems.length > 0 && component.searchCheckListItems(task.ChecklistItems,component.state.filterUser) ) ) ? true : false;
			
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
				<TaskListFilter
					filterUser={this.state.filterUser}
					users={this.state.assignedUsers}
					onUserFiltered={this.filterByUser}
					onNameFiltered={this.filterByName} />
			</div>

		);

	}
});
