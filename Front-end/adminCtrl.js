/*
 * ADMIN CONTROLLER
 * Handles functionality found in the super secret not-secret admin menu
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('adminCtrl', ($scope, $http, $window) => {
    $scope.loggedIn = false;
    $http.get(`${URL}getLoggedIn`).then((response) => {
        $scope.loggedIn = response.data;
    });

    $scope.backButton = () => {
		$window.history.back();
	};

    $scope.shiftGrades = (isInc) => {
        $http.get(`${URL}shiftGrades?isIncrementing=${isInc}`).then(_ => {
            $scope.backButton();
        });
    };

    $scope.terminate = () => {
        if (confirm(`Are you sure you want to terminate ${currentUsername}?`)) {
			$http.get(`${URL}terminateAccount`)
			.then(_ => {
				$http.get(`${URL}logout`).then(_ => {
                    window.location.href = "index.html";
                });
			});
		}
    };
});