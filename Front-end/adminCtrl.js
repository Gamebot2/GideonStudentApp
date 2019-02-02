/*
 * ADMIN CONTROLLER
 * Handles functionality found in the super secret not-secret admin menu
 * 
 * NOTES:
 * - TBI
 */


gideonApp.controller('adminCtrl', ($scope, $http, $window) => {
    $scope.loggedIn = false;
    $http.get(`${URL}getLoggedIn`).then(response => {
        $scope.loggedIn = response.data;
    });

    $scope.backButton = () => {
		$window.history.back();
	}

    $scope.shiftGrades = isInc => {
        $http.get(`${URL}shiftGrades?isIncrementing=${isInc}`).then(response => {
            $scope.backButton();
        })
    }
});