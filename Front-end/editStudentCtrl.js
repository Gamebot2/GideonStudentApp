/*
 * EDIT STUDENT CONTROLLER
 * Contains the functions and variables used in EditStudent.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - The application expects there to be the id and name of a student in the local storage of the window. Make sure these exist before opening LineChart.html.
 */


gideonApp.controller('editStudentCtrl', function($scope, $http, $window) {
	
	// initialize Verify
	Verify.setScope($scope);

	// Gather all information about the student
	$http.get(`${URL}student?Id=${$window.localStorage.getItem(0)}`) // getItem(0) should return the student's id
	.then(function(response) {
		$scope.student = response.data;
		$scope.Id 				= $scope.student.studentId;
		$scope.Client 			= $scope.student.client;
		$scope.Email 			= $scope.student.email;
		$scope.Phone 			= $scope.student.phone;
		$scope.Address 			= $scope.student.address;
		$scope.Grade 			= $scope.student.grade;
		$scope.Gender 			= $scope.student.gender;
		$scope.CurrentPasses 	= $scope.student.currentPasses;
	});

	// Form submission
	$scope.updateStudent = function() {
		if (!Verify.check())
			return;

		try {
			// Creates JSON for the student based on form data
			var newStudentDetails = JSON.stringify({
				id: 			$scope.Id,
				client:			$scope.Client,
				email: 			$scope.Email,
				phone: 			$scope.Phone,
				address: 		$scope.Address,
				grade: 			$scope.Grade,
				gender: 		$scope.Gender,
				currentPasses: 	$scope.CurrentPasses,
			});

			// Updates the student with an HTTP post call
			$http({
				url: `${URL}updateStudent`,
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data:newStudentDetails,
			})
			.then(function(response) {
				if (Verify.successIf(response.data == 0, ""))
					window.location.href = "StudentList.html"; // return back to the list if the update was successful
			})
			.catch(Verify.error);
		}
	}
});