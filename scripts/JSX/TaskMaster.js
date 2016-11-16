var ProjectHeader = React.createClass({displayName: "ProjectHeader",
	render: function() {
		return (
			React.createElement("div", {className: "header-component"}
				
			)
		);
	}
});

var ProjectItem = React.createClass({displayName: "ProjectItem",
	getInitialState: function(){
		return {
			isAvailable: true,
			projectDetails: {},
			userPhoto: {}
		};
	},
	onProjectItemClicked: function(event) {
    	window.location.hash = "#/project/"+ this.state.projectDetails.ProjectID;
  	},
	componentDidMount: function() {

		var component = this;

		genome_api.getProjectDetails(this.props.project)
		.then(function(details) {

			//console.log(details.Entries[0].AccountPortfolioID);

			component.setState({
				projectDetails: details.Entries[0],
				accountID: details.Entries[0].AccountPortfolioID,
				projectStatus: details.Entries[0].ProjectStatusName
			});
			return genome_api.getUser(details.Entries[0].ProjectManagerUserID);
		})
		.then(function(data) {
			component.setState({
				userPhoto: {
					backgroundImage: "url('https://genome.klick.com"+ data.PhotoPath +"')"
				}
			});
			return genome_api.getAccountPortfolio(component.state.accountID);
		})
		.then(function(data) {

			component.setState({
				accountName: data.Entries[0].Name,
				companyName: data.Entries[0].Division
			});
		});
	},
	render: function() {

		var details = this.state.projectDetails;

		return (
			React.createElement("li", {className: "project-item card-item", onClick: this.onProjectItemClicked, "data-project-id": details.ProjectID}, 
				React.createElement("div", {className: "card-photo-container"}, 
					React.createElement("div", {className: "photo", style: this.state.userPhoto}), 
					React.createElement("div", {className: "photo-of"}, details.ProjectManagerName)
				), 
				React.createElement("div", {className: "card-content-container"}, 
					React.createElement("h2", {className: "project-name heading"}, details.CoreName), 
					React.createElement("div", {className: "project-id metadata"}, details.ProjectID), 
					React.createElement("div", {className: "project-portfolio metadata"}, this.state.accountName), 
					React.createElement("div", {className: "project-division metadata"}, this.state.companyName), 
					React.createElement("div", {className: "project-status metadata"}, this.state.projectStatus)
				)
			)
		);

	}
});

var ProjectList = React.createClass({displayName: "ProjectList",
	getInitialState: function(){
		return {
			Projects: [],
			UserID: ""
		};
	},
	componentDidMount: function() {

		var component = this;

		// Get current user ID and their assigned tasks.
		genome_api.getCurrentUser().then(function(id) {
			component.setState({UserID: id});

			return genome_api.getUserTasks(component.state.UserID);
		})
		.then(function(data) {

			var projectIDs = [];

			// Get a list of current projects.
			for (var i = 0; i < data.Entries.length; i++) {
				//console.log(data.Entries[i].ProjectID);
				
				// Check for duplicates.
				if (projectIDs.indexOf(data.Entries[i].ProjectID) < 0)
					projectIDs.push(data.Entries[i].ProjectID);

			}

			component.setState({
				Projects: projectIDs
			});

		});

	},
	render: function() {

		var projectItems = [];

		// Push each task into the array.
		this.state.Projects.forEach(function(projectID) {
			//console.log(task);
			projectItems.push(
				React.createElement(ProjectItem, {project: projectID})
			);
		});

		//console.log(this.state.Projects);

		return (
			React.createElement("div", {className: "project-list-container view-container"}, 
				React.createElement(ProjectHeader, null), 
				React.createElement("ul", {className: "project-list card-list-view"}, 
					projectItems
				)
			)
		);

	}
});

/**
 * Initialize application.
 */
$(document).ready(function(e) {
	
	onRouteChanged();

	// Event Listeners.
	window.addEventListener('hashchange', onRouteChanged, false);

});

/**
 * Event listener when the URL hash changes.
 */
function onRouteChanged() {

	var app_conainter = document.getElementById('app-container');
	var component;

	// Load project tasks.
	if (window.location.hash.indexOf("/project/") > 0) {
		component = React.createElement(TaskList, null);
		$(app_conainter).addClass('task-view')
			.removeClass('project-view');
	}

	// Otherwise, load list of projects.
	else {
		component = React.createElement(ProjectList, null);
		$(app_conainter).addClass('project-view')
			.removeClass('task-view');
	}

	React.render(
		component,
		app_conainter
	);

}
var TaskChecklistItem = React.createClass({displayName: "TaskChecklistItem",
	render: function() {
		return (
			React.createElement("li", {className: "checklist-item"}, 
				React.createElement("div", {className: "checklist-user"}, this.props.user), 
				React.createElement("div", {className: "checklist-description"}, this.props.desc)
			)
		);
	}
});

var TaskDescription = React.createClass({displayName: "TaskDescription",
	getInitialState: function() {
		return {
			TaskTitle: "",
			TaskComments: []
		};
	},
	componentDidMount: function() {
		var component = this;
		var taskID = window.location.hash.substring("7");

		genome_api.getTaskDetails(taskID)
		.then(function(data) {
			//console.log(data.Entries[0]);
			component.setState({
				description: data.Entries[0].Description,
				TaskTitle: data.Entries[0].Title
			});
		})
		.then(function() {
			return genome_api.getTaskComments(taskID);
		})
		.then(function(data) {
			//console.log(data.Entries);
			component.setState({
				TaskComments: data.Entries
			});
		});

	},
	createMarkup: function(markup) {
		return {
			__html: markup
		};
	},
	render: function() {

		// Task details.
		var title = this.state.TaskTitle;
		var desc = this.state.description;

		// Task comments.
		var comments = [];
		this.state.TaskComments.forEach(function(comment) {
			comments.push(React.createElement(TaskComment, {details: comment}));
		});

		return (
			React.createElement("div", {className: "task-description"}, 
				React.createElement("div", {className: "task-details"}, 
					React.createElement("h1", {className: "title"}, title), 
					React.createElement("p", {className: "description", dangerouslySetInnerHTML: this.createMarkup(desc)})
				), 

				React.createElement("h2", null, "Comments"), 
				
				React.createElement(TaskAddComment, null), 

				React.createElement("ul", {className: "task-comments"}, 
					comments
				)
			)
		);
	}
});

var TaskHeader = React.createClass({displayName: "TaskHeader",
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
			React.createElement("div", {className: "header-component"}, 
				React.createElement("a", {className: "btn-back nav-btns", onClick: this.onBackSelect}, "Back"), 
				React.createElement("div", {className: "header-title"}, this.props.projectName)
			)
		);
	}
});

var TaskItem = React.createClass({displayName: "TaskItem",
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
		var taskURL = "https://genome.klick.com/tickets/#/details/"+ this.props.task.TicketID;
		var taskChecklist;

		// Check to see if this task has any checklist items.
		if (this.props.task.ChecklistItems.length > 0) {
			taskChecklist = React.createElement(TaskSubitem, {subtasks: this.props.task.ChecklistItems})
		}

		return (
			React.createElement("li", {className: "task-item card-item"}, 
				React.createElement("a", {href: taskURL, target: "_blank", className: "task-link"}, 
					React.createElement("div", {className: "card-photo-container"}, 
						React.createElement("div", {className: "photo", style: this.state.userPhoto}), 
						React.createElement("div", {className: "photo-of task-user"}, this.props.task.AssigneeUserFullName)
					), 
					React.createElement("div", {className: "card-content-container"}, 
						React.createElement("h2", {className: "heading"}, this.props.task.Title), 
						React.createElement("div", {className: "task-portfolio metadata"}, "Status: ", this.props.task.TicketStatusName), 
						React.createElement("div", {className: "task-updated metadata"}, "Last updated: ", Util.absoluteDate(this.props.task.Updated), " by ", this.state.updatedUserName), 
						React.createElement("div", {className: "task-deadline metadata"}, "Deadline: ", this.state.deadline), 
						React.createElement("div", {className: "task-id metadata"}, this.props.task.TicketID)
					), 
					taskChecklist
				)
			)
		);
	}
});

var TaskList = React.createClass({displayName: "TaskList",
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
					React.createElement(TaskItem, {task: task, currentUser: component.state.currentUser})
				);
			}
		}.bind(this));

		return (
			React.createElement("div", {className: "task-list-container view-container"}, 
				React.createElement(TaskHeader, {projectName: this.state.currentProjectName}), 
				React.createElement("ul", {className: "task-list card-list-view"}, 
					projectTasks
				), 
				React.createElement(TaskListFilter, {
					filterUser: this.state.filterUser, 
					users: this.state.assignedUsers, 
					onUserFiltered: this.filterByUser, 
					onNameFiltered: this.filterByName})
			)

		);

	}
});

var TaskListFilter = React.createClass({displayName: "TaskListFilter",
	getInitialState: function() {
		return {
			
		}
	},
	componentDidMount: function() {

	},
	render: function() {

		var usersList = [];

		// Sort by first name.
		this.props.users.sort(function(a, b) {
			if(a.userName < b.userName) return -1;
			if(a.userName > b.userName) return 1;
			return 0;
		});

		// Create dropdown options.
		this.props.users.forEach(function(user) {
			usersList.push(
				React.createElement("option", {value: user.id}, user.userName)
			);
		});

		return (
			React.createElement("div", {className: "filter-container1"}
			)

		);

		/*
			<div className="filter-container">
				<div className="filter-user">
					User:
					<select onChange={this.props.onUserFiltered} value={this.props.filterUser}>
						<option value="0">--</option>
						{usersList}
					</select>
				</div>
				<div className="filter-name">
					<input className="name-filter" type="text" onChange={this.props.onNameFiltered} />
				</div>
			</div>
		*/

	}
});

var TaskSubitem = React.createClass({displayName: "TaskSubitem",
	getInitialState: function() {
		return {
			title: ""
		};
	},
	render: function() {

		var items = [];

		// Loop through all subtasks/checklist items in this ticket/task.
		this.props.subtasks.forEach(function(item) {
			if (item.TicketStatusName == "open") {
				var assignedUser = item.AssignedToUserName != null ? item.AssignedToUserName : "Unassigned";
				items.push(
					React.createElement(TaskChecklistItem, {user: assignedUser, desc: item.Description})
				);
			}
		});

		return (
			React.createElement("div", {className: "card-container task-checklist-container cf"}, 
				React.createElement("h2", {className: "heading"}, "Subtasks"), 
				React.createElement("ul", {className: "task-checklist metadata"}, 
					items
				)
			)
		);
	}
});