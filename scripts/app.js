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
	getUser: function(userID) {
		var deferred = Q.defer();
		
		this.jsonp("User/Details?UserID="+ userID)
		.then(function(data) {
			deferred.resolve(data.Entries[0]);
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
	},
	getProjectTasks: function(taskID) {

		var deferred = Q.defer();

		this.jsonp('Ticket/Filter?TicketStatusIsOpen=true&ProjectID='+ taskID +'&WithChecklistItems=true')
		.then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;
	},
	getProjectBudget: function(projectID) {
		var deferred = Q.defer();

		this.jsonp('Project/Budget?ProjectID='+ projectID)
		.then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;
	},
	getAccountPortfolio: function(accountID) {

		var deferred = Q.defer();

		this.jsonp('AccountPortfolio?AccountPortfolioID='+ accountID)
		.then(function(data) {
			deferred.resolve(data);
		});

		return deferred.promise;
	}
};

var Util = {
	toDate: function(date) {

		var currentUserDate = new Date();

		if (!date || date == "") return

		if (date instanceof Date) return date;

		if (typeof(date) == 'string') {

			if (date.indexOf('/Date(') == 0)
				return date instanceof Date ? date : new Date(parseInt(date.substr(6)));

			if (date.length > 0 && date[0] == '"' && date[date.length-1] == '"')
				date = date.substring(1, date.length-1);
		}

		return new Date(Date.parse(date));
	},

	relativeDate: function(date) {
		date = this.toDate(date);
		if (!date || !(date instanceof Date)) return "";
		return moment(date).fromNow();
	},

	absoluteDate: function(date) {
		date = this.toDate(date);
		if (!date || !(date instanceof Date)) return "";
		return moment(date).format("MMM D, YYYY");
	}
}
