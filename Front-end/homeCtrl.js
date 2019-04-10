/*
 * HOME CONTROLLER
 * Contains the functionality of the login page for the application (index.html)
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('homeCtrl', ($scope, $http) => {

	// Initialize Verify
	Verify.setScope($scope);

	// Attempt a login
	$scope.login = () => {
		$http.get(`${URL}login?user=${$scope.username}&pass=${$scope.password}`)
		.then((response) => {
			if (!Verify.errorIf(response.data < 0, "Username and/or password not recognized.")) {
				window.location.href = "StudentList.html";
			}
		});
	};

	// Proceed as a guest
	$scope.guest = () => {
		$http.get(`${URL}logout`)
		.then((response) => {
			// Check for an error - do not proceed if the user is unable to logout!
			if (!Verify.errorIf(response.data < 0, "Error")) {
				window.location.href = "StudentList.html";
			}
		});
	};

	// UNUSED FUNCTION: register
	$scope.register = () => {
		$http.get(`${URL}register?user=${$scope.username}&pass=${$scope.password}`);
	};

});