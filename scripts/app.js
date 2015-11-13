var genome_api = {
	jsonp: function(url) {
    	var deferred = Q.defer();

		$.ajax({
			url: 'https://genome.klick.com:443/api/'+ url,
			dataType: 'jsonp'
		}).done(function(result) {
			deferred.resolve(result);
		});

    	return deferred.promise;
	},
	getCurrentUser: function() {
		var deferred = Q.defer();
		
		this.jsonp("User/Current")
		.then(function(data) {
			deferred.resolve(data.Entries[0].UserID);
		});

		return deferred.promise;
	},
	getUserTasks: function(userID) {
		var deferred = Q.defer();
		
		this.jsonp('Ticket/Filter?AssignedToUserID='+ userID +'&TicketStatusIsOpen=true')
		.then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;
	},
	getTaskDetails: function(TaskID) {
		var deferred = Q.defer();

		this.jsonp('Ticket/Filter?TicketID='+ TaskID)
		.then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;
	},
	getTaskComments: function(TaskID) {
		var deferred = Q.defer();

		this.jsonp('Ticket/Comment?TicketID='+ TaskID)
		.then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;
	},
	getProjectDetails: function(projectID) {

		var deferred = Q.defer();

		this.jsonp('Project?ProjectID='+ projectID)
		.then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;

	}
};
