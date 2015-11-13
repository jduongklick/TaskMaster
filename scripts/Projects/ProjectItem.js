var ProjectItem = React.createClass({
	getInitialState: function(){
		return {
			projectDetails: {}
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
				projectDetails: details.Entries[0]
			});
			
		});

	},
	render: function() {

		var details = this.state.projectDetails;

		return (
			<li className="project-item card-item" onClick={this.onProjectItemClicked}>
				<h2 className="title">{details.Name}</h2>
				<div className="metadata">Project Manager: {details.ProjectManagerName}</div>
			</li>
		);

	}
});
