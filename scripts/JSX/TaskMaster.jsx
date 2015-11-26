/**
 * Initialize application.
 */
$(document).ready(function(e) {
	
	onRouteChanged();

	// Event Listeners.
	window.addEventListener('hashchange', onRouteChanged, false);

});

/**
 * Event listener when the URL hash changes.
 */
function onRouteChanged() {

	var app_conainter = document.getElementById('app-container');
	var component;

	// Load project view.
	if (window.location.hash.indexOf("/project/") > 0) {
		component = <TaskList/>;
		$(app_conainter).addClass('task-view')
			.removeClass('project-view');
	}

	else {
		component = <ProjectList/>;
		$(app_conainter).addClass('project-view')
			.removeClass('task-view');
	}

	React.render(
		component,
		app_conainter
	);

}