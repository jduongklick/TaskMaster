var ProjectItem = React.createClass({
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
			<li className="project-item card-item" onClick={this.onProjectItemClicked} data-project-id={details.ProjectID}>
				<div className="card-photo-container">
					<div className="photo" style={this.state.userPhoto}></div>
					<div className="photo-of">{details.ProjectManagerName}</div>
				</div>
				<div className="card-content-container">
					<h2 className="project-name heading">{details.CoreName}</h2>
					<div className="project-id metadata">{details.ProjectID}</div>
					<div className="project-portfolio metadata">{this.state.accountName}</div>
					<div className="project-division metadata">{this.state.companyName}</div>
					<div className="project-status metadata">{this.state.projectStatus}</div>
				</div>
			</li>
		);

	}
});


/*
				<div className="card-photo-container">
					<div className="photo" style={this.state.userPhoto}></div>
					<div className="photo-of">{details.ProjectManagerName}</div>
				</div>
				<div className="card-content-container">
					<h2 className="project-name heading">{details.CoreName}</h2>
					<div className="project-portfolio metadata">{this.state.accountName}</div>
					<div className="project-division metadata">{this.state.companyName}</div>
					<div className="project-status metadata">{this.state.projectStatus}</div>
				</div>
*/
