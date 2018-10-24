/*
 * LIST CONTROLLER
 * Contains the functions and variables used in StudentList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('listCtrl', ($scope, $http, $window) => {

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
	$scope.expandedStudentId = -1;
	$scope.toggleButtonText = dataOn[dataOn.switch][1];

	var getStudents = () => {
		$http.get(`${URL}${dataOn[dataOn.switch][0]}`)
		.then(response => {
			$scope.students = response.data;
		});
		$scope.toggleButtonText = dataOn[dataOn.switch][1];
	}
	getStudents();

	$scope.toggleData = () => {
		dataOn.switch = !dataOn.switch;
		getStudents();
	}
	

	$scope.manageExpansion = studentId => {
		if ($scope.expandedStudentId == studentId)
			$scope.expandedStudentId = -1;
		else
			$scope.expandedStudentId = studentId;
	}


	$scope.lineChartButton = student => {
		$window.localStorage.setItem(0, student.studentId);
		$window.localStorage.setItem(1, student.client);
		window.location.href = "LineChart.html";
	}
	$scope.editStudentButton = student => {
		$window.localStorage.setItem(0, JSON.stringify(student));
		window.location.href = "EditStudent.html";
	}
	$scope.preloadRecordsList = student => {
		$window.localStorage.setItem(3, true);
		$window.localStorage.setItem(4, student.client);
		window.location.href = "RecordList.html";
	}
});