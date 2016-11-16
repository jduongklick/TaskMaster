var TaskSubitem = React.createClass({
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
					<TaskChecklistItem user={assignedUser} desc={item.Description} />
				);
			}
		});

		return (
			<div className="card-container task-checklist-container cf">
				<h2 className="heading">Subtasks</h2>
				<ul className="task-checklist metadata">
					{items}
				</ul>
			</div>
		);
	}
});