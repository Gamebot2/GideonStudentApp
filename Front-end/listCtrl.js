/*
 * LIST CONTROLLER
 * Contains the functions and variables used in StudentList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('listCtrl', function($scope, $http, $window) {

	$scope.getStudents = function() {
		$http.get(`${URL}${$scope.dataOn ? "dataStudents" : "students"}`)
		.then(function(response) {
			$scope.students = response.data;
		});
		$scope.toggleButtonText = $scope.dataOn ? "Display All Students" : "Display Students with Records";
	}

	$scope.toggleData = function() {
		$scope.dataOn = !$scope.dataOn;
		$scope.getStudents();
	}

	$scope.dataOn = false;
	$scope.active = false;
	$scope.getStudents();

	$scope.manageExpansion = function(student) {
		if ($scope.expandedStudent == student)
			$scope.expandedStudent = null;
		else
			$scope.expandedStudent = student;
	}

	//Function for selecting a student and going to the chart page
	$scope.logStudent = function(id, name) {
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = "LineChart.html";
	}

	$scope.editStudent = function(id, name) {
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = "EditStudent.html";
	}
});