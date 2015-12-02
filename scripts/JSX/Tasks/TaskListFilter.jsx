var TaskListFilter = React.createClass({
	getInitialState: function() {
		return {
			
		}
	},
	componentDidMount: function() {

	},
	render: function() {

		var usersList = [];

		// Sort by first name.
		this.props.users.sort(function(a, b) {
			if(a.userName < b.userName) return -1;
			if(a.userName > b.userName) return 1;
			return 0;
		});

		// Create dropdown options.
		this.props.users.forEach(function(user) {
			usersList.push(
				<option value={user.id}>{user.userName}</option>
			);
		});

		return (
			<div className="filter-container">
				<div className="filter-user">
					User:
					<select onChange={this.props.onUserFiltered} value={this.props.filterUser}>
						<option value="0">--</option>
						{usersList}
					</select>
				</div>
				<div className="filter-name">
					<input className="name-filter" type="text" onChange={this.props.onNameFiltered} />
				</div>
			</div>

		);

	}
});
