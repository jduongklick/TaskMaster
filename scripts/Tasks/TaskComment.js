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
				<div className="comment-author">
					<div className="author-photo" style={userPhoto}></div>
					<div className="author-name">{this.props.details.UserName}</div>
				</div>
				<div className="comment-contents" dangerouslySetInnerHTML={this.createMarkup(this.props.details.Comment)}></div>
				
			</li>
		);
	}
});

//{this.props.details.Created}