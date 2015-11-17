var TaskComment = React.createClass({
	createMarkup: function(markup) {
		return {
			__html: markup
		};
	},
	render: function() {
		//console.log(this.props.details);

		var userPhoto = {
			backgroundImage: "url('https://genome.klick.com"+ this.props.details.UserPhotoPath +"')"
		};

		return (
			<li className="comment">
				<div className="card-photo-container">
					<div className="photo" style={userPhoto}></div>
					<div className="photo-of">{this.props.details.UserName}</div>
				</div>
				<div className="card-content-container" dangerouslySetInnerHTML={this.createMarkup(this.props.details.Comment)}></div>
			</li>
		);
	}
});