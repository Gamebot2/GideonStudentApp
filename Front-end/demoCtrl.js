/*
 * DEMO CONTROLLER
 * Literally only goes back.
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('demoCtrl', ($scope, $http, $window) => {
    $scope.backButton = () => {
		$window.history.back();
	};
});