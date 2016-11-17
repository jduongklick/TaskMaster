var ProjectItem = React.createClass({
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
			component.setState({
				projectDetails: details.Entries[0],
				projectStatus: details.Entries[0].ProjectStatusName,
			});

			// Get the PM on the project.
			return genome_api.getUser(details.Entries[0].ProjectManagerUserID);
		})
		.then(function(data) {
			component.setState({
				userPhoto: {
					backgroundImage: "url('https://genome.klick.com"+ data.PhotoPath +"')"
				}
			});

			// Get project budget details.
			return genome_api.getProjectBudget(component.state.projectDetails.ProjectID);
		})
		.then(function(data) {
			var estimate = data.Data.Forecast.Estimate
			var actual = data.Data.Forecast.Actual
			var balance = estimate - actual;

			component.setState({
				projectEstimate: numeral(estimate).format('$0,0.00'),
				projectActual: numeral(actual).format('$0,0.00'),
				projectBalance: numeral(estimate - actual).format('$0,0.00'),
				projectBudgetStyle: {
					color: balance > 0 ? 'green' : 'red'
				}
			});
		});
	},
	render: function() {

		var details = this.state.projectDetails;

		return (
			<li className="project-item card-item animated fadeInDown" onClick={this.onProjectItemClicked} data-project-id={details.ProjectID}>
				<div className="card-photo-container">
					<div className="photo" style={this.state.userPhoto}></div>
					<div className="photo-of">{details.ProjectManagerName}</div>
				</div>
				<div className="card-content-container">
					<h2 className="project-name heading">{details.CoreName}</h2>
					<div className="project-status metadata">Project status: {this.state.projectStatus}</div>
					<div className="project-date-created metadata">Project created: {Util.absoluteDate(details.CreatedDate)}</div>


					<div className="project-budget metadata">Balance: <span style={this.state.projectBudgetStyle}>{this.state.projectBalance}</span></div>
				</div>
			</li>
		);

	}
});
