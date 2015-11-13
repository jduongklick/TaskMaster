/**
 * Initialize application.
 */
$(document).ready(function(e) {
	onRouteChanged();
});

/**
 * Event listener when the URL hash changes.
 */
window.addEventListener('hashchange', onRouteChanged, false);
function onRouteChanged() {

	// Unmount current component.
	React.unmountComponentAtNode(document.getElementById('app-container'));


	// Load project view.
	if (window.location.hash.indexOf("/project/") > 0) {
		React.render(
			<TaskList/>,
			document.getElementById('app-container')
		);
	}

	// Load task view.
	else if (window.location.hash.indexOf("/task/") > 0) {
		React.render(
			<TaskDescription/>,
			document.getElementById('app-container')
		);
	}

	else {
/*
		React.render(
			<ProjectList/>,
			document.getElementById('app-container')
		);
		
*/

		React.render(
			<TaskList/>,
			document.getElementById('app-container')
		);
		
	}

}

