var TaskListFilter = React.createClass({
	getInitialState: function() {
		return {
			
		}
	},
	componentDidMount: function() {
		this.setState({
			currentUser: this.props.currentUser
		});
	},
	render: function() {

		var usersList = [];
		var component = this;

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
