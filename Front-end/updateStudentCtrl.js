/*
 * UPDATE STUDENT CONTROLLER
 * Contains the functions and variables used in InsertStudent.html and EditStudent.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - For EditStudent, the application expects there to be a student JSON string in storage slot 0. Make sure this exists before opening the page.
 */


gideonApp.controller('updateStudentCtrl', ($scope, $http, $window) => {
	
	// Initialize Verify
	Verify.setScope($scope);

	// Arrays of all grade and gender options
	$scope.grades = ["PreK (-1)", "Kinder (0)", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
	$scope.genders = ["Male", "Female"];

	if (window.location.href.includes("Edit")) {
		// Load a student from the local storage if on the edit page
		$scope.student = JSON.parse($window.localStorage.getItem(0));
	} else {
		$scope.student = {};
	}

	// Form submission
	updateStudent = (command) => {
		if (!Verify.check()) {
			return;
		}

		// Updates the student with an HTTP post call
		$http({
			url: `${URL}${command}Student`,
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			data: JSON.stringify($scope.student)
		})
		.then((response) => {
			Verify.successIf(response.data >= 0, `Successfully ${command}ed ${$scope.student.client}`);
		})
		.catch(Verify.error);
	};
	
	$scope.insertStudent = () => updateStudent("insert");
	$scope.editStudent = () => updateStudent("edit");


	// Delete button
	$scope.removeStudent = () => {
		if (confirm(`Are you sure you want to delete ${$scope.student.client} and all of their records? This cannot be undone!`)) {
			$http.get(`${URL}removeStudent?Id=${$scope.student.studentId}`)
			.then((response) => {
				if (Verify.successIf(response.data >= 0, "Deleted.")) {
					// Return back to the list if the delete was successful
					window.location.href = "StudentList.html";
				}
			});
		}
	};
});