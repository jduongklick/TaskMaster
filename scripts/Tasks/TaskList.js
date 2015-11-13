var TaskList = React.createClass({
	getInitialState: function(){
		return {
			tasks: [],
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
		})
		.then(function() {
			return genome_api.getUserTasks(component.state.UserID);
		})
		.then(function(data) {
			//console.log(data.Entries);
			component.setState({
				tasks: data.Entries
			});
		});

		//TweenMax.staggerTo($('.task-item'), 1, {opacity: 1, ease:Power2.easeInOut});

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
