/**
 * Initialize application.
 */
$(document).ready(function(e) {
	onRouteChanged();

	// Event Listeners.
	$('.btn-back').click(onBackClicked);
	window.addEventListener('hashchange', onRouteChanged, false);

});

/**
 * Event listener when the URL hash changes.
 */
function onRouteChanged() {

	var app_conainter = document.getElementById('app-container');

	// Unmount current component.
	React.unmountComponentAtNode(document.getElementById('app-container'));

	// Load project view.
	if (window.location.hash.indexOf("/project/") > 0) {
		React.render(
			<TaskList/>,
			app_conainter
		);
	}

	// Load task view.
	else if (window.location.hash.indexOf("/task/") > 0) {
		React.render(
			<TaskDescription/>,
			app_conainter
		);
	}

	else {
		React.render(
			<ProjectList/>,
			app_conainter
		);
	}

}

/**
 * 
 */
function onBackClicked(e) {
	window.history.back();
}