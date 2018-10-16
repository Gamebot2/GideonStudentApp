/*
 * EDIT STUDENT CONTROLLER
 * Contains the functions and variables used in EditStudent.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - The application expects there to be the id and name of a student in the local storage of the window. Make sure these exist before opening LineChart.html.
 */


gideonApp.controller('editStudentCtrl', ($scope, $http, $window) => {
	
	// initialize Verify
	Verify.setScope($scope);

	// Gather all information about the student
	$http.get(`${URL}student?Id=${$window.localStorage.getItem(0)}`) // getItem(0) should return the student's id
	.then(response => {
		$scope.student = response.data;
	});

	// Form submission
	$scope.updateStudent = () => {
		if (!Verify.check())
			return;

		// Updates the student with an HTTP post call
		try {
			$http({
				url: `${URL}updateStudent`,
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data: JSON.stringify($scope.student),
			})
			.then(response => {
				if (Verify.successIf(response.data == 0, ""))
					window.location.href = "StudentList.html"; // return back to the list if the update was successful
			})
			.catch(Verify.error);
		} catch (err) {
			Verify.error(err);
		}
	}
});