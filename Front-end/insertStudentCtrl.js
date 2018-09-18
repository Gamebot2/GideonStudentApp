/*
 * INSERT STUDENT CONTROLLER
 * Contains the functions and variables used in InsertStudent.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 */


gideonApp.controller('insertStudentCtrl', function($scope, $http) {

	// initialize Verify
	Verify.setScope($scope);

	// Form submission
	$scope.createStudent = function() {
		if (!Verify.check($scope))
			return;

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
			Verify.successIf(response.data == 0, `Successfully added ${$scope.Client}`, $scope);
		});
	}
});