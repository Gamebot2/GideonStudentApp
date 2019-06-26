/*
 * ADMIN CONTROLLER
 * Handles functionality found in the super secret not-secret admin menu
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('adminCtrl', ($scope, $http) => {
    // Check if the user is currently logged in
    $scope.loggedIn = false;
    $http.get(`${URL}getLoggedIn`).then((response) => {
        $scope.loggedIn = response.data;

        // If the user is not logged in, redirect to the demo page
        if (!$scope.loggedIn) {
            window.location.href = "Demo.html";
        }
    });

    // Function for the button that increments or decrements everyone's grade level
    $scope.shiftGrades = (isInc) => {
        if (confirm(`This action can potentially be unstable and should only be used when absolutely necessary. Are you sure you want to change all students' grades?`)) {
            $http.get(`${URL}shiftGrades?isIncrementing=${isInc}`)
            .then(_ => {
                $scope.backButton();
            });
        }
    };

    // Function that closes down the current account in case of a security breach
    $scope.terminate = () => {
        if (confirm(`Are you sure you want to terminate ${currentUsername}?`)) {
			$http.get(`${URL}terminateAccount`)
			.then(_ => {
                // Force logout when the account ends
                $http.get(`${URL}logout`)
                .then(_ => {
                    window.location.href = "index.html";
                });
			});
		}
    };
});