var TaskDescription = React.createClass({
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
			comments.push(<TaskComment details={comment} />);
		});

		return (
			<div className="task-description">
				<div className="task-details">
					<h1 className="title">{title}</h1>
					<p className="description" dangerouslySetInnerHTML={this.createMarkup(desc)}></p>
				</div>

				<h2>Comments</h2>
				
				<TaskAddComment/>

				<ul className="task-comments">
					{comments}
				</ul>
			</div>
		);
	}
});
