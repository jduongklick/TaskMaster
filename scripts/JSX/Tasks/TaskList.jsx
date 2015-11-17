var TaskList = React.createClass({
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
				<TaskItem 
					task={task}
				/>
			);
		});

		return (
			<ul className="task-list card-list-view">
				{userTasks}
			</ul>
		);

	}
});
