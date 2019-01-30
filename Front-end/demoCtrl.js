/*
 * DEMO CONTROLLER
 * Literally only goes back.
 * 
 * NOTES:
 * - This controller does a whole lot of nothing
 */


gideonApp.controller('demoCtrl', ($scope, $http, $window) => {
    $scope.backButton = () => {
		$window.history.back();
	}
});