/*
 * INSERT STUDENT CONTROLLER
 * Contains the functions and variables used in InsertStudent.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 */


gideonApp.controller('insertStudentCtrl', ($scope, $http) => {

	// initialize Verify
	Verify.setScope($scope);

	// Form submission
	$scope.createStudent = () => {
		if (!Verify.check())
			return;

		// Inserts the student with an HTTP post call
		try {
			$http({
				url: `${URL}addStudent`,
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data: JSON.stringify($scope.student),
			})
			.then(response => {
				Verify.successIf(response.data >= 0, `Successfully added ${$scope.student.client}`);
			})
			.catch(Verify.error);
		}
		catch (err) {
			Verify.error(err);
		}
	}
});