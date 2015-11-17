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
			<li className="project-item card-item" onClick={this.onProjectItemClicked}>
				<div className="card-photo-container">
					<div className="photo" style={this.state.userPhoto}></div>
					<div className="photo-of">{details.ProjectManagerName}</div>
				</div>
				<div className="card-content-container">
					<h2 className="project-name heading">{details.CoreName}</h2>
					<div className="project-portfolio">{this.state.accountName}</div>
					<div className="project-division">{this.state.companyName}</div>
				</div>
			</li>
		);

	}
});
