/*
 * LIST CONTROLLER
 * Contains the functions and variables used in StudentList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('listCtrl', function($scope, $http, $window) {

	var dataOn = {
		true: ["dataStudents", "Display All Students"],
		false: ["students", "Display Students With Records"],
		switch: false,
	};

	//Preload $scope.students with an initial "loading" value and the toggle button text with its initial state
	$scope.students = [{
		client: "Loading",
		email: "",
	}];
	$scope.toggleButtonText = dataOn[dataOn.switch][1];

	$scope.getStudents = function() {
		$http.get(`${URL}${dataOn[dataOn.switch][0]}`)
		.then(function(response) {
			$scope.students = response.data;
		});
		$scope.toggleButtonText = dataOn[dataOn.switch][1];
	}
	$scope.getStudents();

	$scope.toggleData = function() {
		dataOn.switch = !dataOn.switch;
		$scope.getStudents();
	}
	

	$scope.manageExpansion = function(studentId) {
		if ($scope.expandedStudentId == studentId)
			$scope.expandedStudentId = -1;
		else
			$scope.expandedStudentId = studentId;
	}

	//Function for selecting a student and going to another page
	$scope.logToPage = function(id, name, page) {
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = page;
	}
});