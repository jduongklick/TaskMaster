var TaskListFilter = React.createClass({
	render: function() {

		var usersList = [];

		this.props.users.forEach(function(user) {
			usersList.push(
				<option value={user.id}>{user.userName}</option>
			);
		});

		return (
			<div className="filter-container">
				<div>
					Assigned user:
					<select onChange={this.props.onUserFiltered}>
						<option value="0">--</option>
						{usersList}
					</select>
				</div>
			</div>

		);

	}
});
