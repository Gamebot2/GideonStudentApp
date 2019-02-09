/*
 * EDIT STUDENT CONTROLLER
 * Contains the functions and variables used in EditStudent.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - The application expects there to be a student JSON string in storage slot 0. Make sure this exists before opening EditStudent.html.
 */


gideonApp.controller('editStudentCtrl', ($scope, $http, $window) => {
	
	// initialize Verify
	Verify.setScope($scope);

	$scope.student = JSON.parse($window.localStorage.getItem(0));


	// Form submission
	$scope.updateStudent = () => {
		if (!Verify.check()) {
			return;
		}

		// Updates the student with an HTTP post call
		try {
			$http({
				url: `${URL}updateStudent`,
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data: JSON.stringify($scope.student)
			})
			.then((response) => {
				if (Verify.successIf(response.data >= 0, "Successfully updated.")) {
					window.location.href = "StudentList.html"; // return back to the list if the update was successful
				}
			})
			.catch(Verify.error);
		} catch (err) {
			Verify.error(err);
		}
	};


	// Delete button
	$scope.removeStudent = () => {
		if (confirm(`Are you sure you want to delete ${$scope.student.client} and all of their records? This cannot be undone!`)) {
			$http.get(`${URL}removeStudent?Id=${$scope.student.studentId}`)
			.then((response) => {
				if (Verify.successIf(response.data >= 0, "Deleted.")) {
					window.location.href = "StudentList.html"; // return back to the list if the delete was successful
				}
			});
		}
	};
});