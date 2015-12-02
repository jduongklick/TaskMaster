var ProjectList = React.createClass({
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
			//component.setState({UserID: 5669}); // James MacDonald projects and his tasks....
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
				<ProjectItem project={projectID} />
			);
		});

		return (
			<div className="project-list-container view-container">
				<ProjectHeader />
				<ul className="project-list card-list-view">
					{projectItems}
				</ul>
			</div>
		);

	}
});
