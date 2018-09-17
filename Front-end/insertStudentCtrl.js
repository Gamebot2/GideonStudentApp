/*
 * INSERT STUDENT CONTROLLER
 * Contains the functions and variables used in InsertStudent.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('insertStudentCtrl', function($scope, $http) {

	// Form submission
	$scope.createStudent = function() {
		if ($scope.form.$valid){
			$scope.formStatus = 2;
			$scope.formStatusText = "Processing...";

			// Creates JSON for the student based on form data
			var newStudentDetails = JSON.stringify({
				client: $scope.Client,
				grade: 	$scope.Grade,
				gender: $scope.Gender,
			});

			// Inserts the student with an HTTP post call
			$http({
				url: 'http://localhost:8081/addStudent',
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data:newStudentDetails,
			}).then(function(response) {
				if (response.data == 0) {
					$scope.formStatus = 1;
					$scope.formStatusText = `Successfully added ${$scope.Client}`;
				} else {
					$scope.formStatus = 0;
					$scope.formStatusText = "Error";
				}
			});
		}
		else {
			$scope.formStatus = 0;
			$scope.formStatusText = "Invalid Form";
		}
	}
});