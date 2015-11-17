var ProjectItem = React.createClass({displayName: "ProjectItem",
	getInitialState: function(){
		return {
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
			//console.log(details.Entries[0]);
			component.setState({
				projectDetails: details.Entries[0],
				accountID: details.Entries[0].AccountPortfolioID
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
			React.createElement("li", {className: "project-item card-item", onClick: this.onProjectItemClicked}, 
				React.createElement("div", {className: "card-photo-container"}, 
					React.createElement("div", {className: "photo", style: this.state.userPhoto}), 
					React.createElement("div", {className: "photo-of"}, details.ProjectManagerName)
				), 
				React.createElement("div", {className: "card-content-container"}, 
					React.createElement("h2", {className: "project-name heading"}, details.CoreName), 
					React.createElement("div", {className: "project-portfolio"}, this.state.accountName), 
					React.createElement("div", {className: "project-division"}, this.state.companyName)
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
			component.setState({
				UserID: id
			});

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
				React.createElement(ProjectItem, {
					project: projectID}
				)
			);
		});

		return (
			React.createElement("ul", {className: "project-list card-list-view"}, 
				projectItems
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
	$('.btn-back').click(onBackClicked);
	window.addEventListener('hashchange', onRouteChanged, false);

});

/**
 * Event listener when the URL hash changes.
 */
function onRouteChanged() {

	var app_conainter = document.getElementById('app-container');

	// Unmount current component.
	React.unmountComponentAtNode(document.getElementById('app-container'));

	// Load project view.
	if (window.location.hash.indexOf("/project/") > 0) {
		React.render(
			React.createElement(TaskList, null),
			app_conainter
		);
	}

	// Load task view.
	else if (window.location.hash.indexOf("/task/") > 0) {
		React.render(
			React.createElement(TaskDescription, null),
			app_conainter
		);
	}

	else {
		React.render(
			React.createElement(ProjectList, null),
			app_conainter
		);
	}

}

/**
 * 
 */
function onBackClicked(e) {
	window.history.back();
}
var TaskAddComment = React.createClass({displayName: "TaskAddComment",
	render: function() {
		return (
			React.createElement("div", {className: "task-add-comment"}, 
				React.createElement("textarea", {className: "task-commentbox"}
				)
			)
		)
	}
});

//{this.props.details.Created}
var TaskComment = React.createClass({displayName: "TaskComment",
	createMarkup: function(markup) {
		return {
			__html: markup
		};
	},
	render: function() {
		//console.log(this.props.details);

		var userPhoto = {
			backgroundImage: "url('https://genome.klick.com"+ this.props.details.UserPhotoPath +"')"
		};

		return (
			React.createElement("li", {className: "comment"}, 
				React.createElement("div", {className: "card-photo-container"}, 
					React.createElement("div", {className: "photo", style: userPhoto}), 
					React.createElement("div", {className: "photo-of"}, this.props.details.UserName)
				), 
				React.createElement("div", {className: "card-content-container", dangerouslySetInnerHTML: this.createMarkup(this.props.details.Comment)})
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

		return (
			React.createElement("li", {className: "task-item card-item", onClick: this.onTaskItemClicked}, 
				React.createElement("div", {className: "card-photo-container"}, 
					React.createElement("div", {className: "photo", style: this.state.userPhoto}), 
					React.createElement("div", {className: "photo-of task-user"}, this.props.task.AssigneeUserFullName)
				), 
				React.createElement("div", {className: "card-content-container"}, 
					React.createElement("h2", {className: "heading"}, this.props.task.Title), 
					
					React.createElement("div", {className: "task-portfolio"}, "Status: ", this.props.task.TicketStatusName), 
					React.createElement("div", {className: "task-updated metadata"}, "Last updated on ", Util.absoluteDate(this.props.task.Updated), " by ", this.state.updatedUserName), 
					React.createElement("div", {className: "task-deadline metadata"}, "Deadline: ", this.state.deadline), 
					React.createElement("div", {className: "task-id metadata"}, this.props.task.TicketID)
				)
			)
		);
	}
});

var TaskList = React.createClass({displayName: "TaskList",
	getInitialState: function(){
		return {
			tasks: [],
		};
	},
	componentDidMount: function() {

		var component = this;

		// Get current user ID and their assigned tasks.
		genome_api.getProjectTasks(window.location.hash.substring(10)).then(function(data) {
			component.setState({
				tasks: data.Entries
			});
		});

	},
	render: function() {

		var userTasks = [];

		// Push each task into the array.
		this.state.tasks.forEach(function(task) {
			//console.log(task);
			userTasks.push(
				React.createElement(TaskItem, {
					task: task}
				)
			);
		});

		return (
			React.createElement("ul", {className: "task-list card-list-view"}, 
				userTasks
			)
		);

	}
});
