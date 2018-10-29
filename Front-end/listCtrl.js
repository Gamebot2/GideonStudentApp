/*
 * LIST CONTROLLER
 * Contains the functions and variables used in StudentList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The page requires slots 2, 3, and 4 in the window storage to track the previously used filters during the session. These slots should be unused in every other page, unless they are being used to pre-initialize filter values for this page.
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
	
	// ACCORDION MANAGEMENT
	$scope.manageExpansion = studentId => {
		if ($scope.expandedStudentId == studentId)
			$scope.expandedStudentId = -1;
		else
			$scope.expandedStudentId = studentId;
	}

	// ACCORDION BUTTONS
	$scope.lineChartButton = student => {
		$window.localStorage.setItem(0, JSON.stringify(student));
		window.location.href = "LineChart.html";
	}
	$scope.editStudentButton = student => {
		$window.localStorage.setItem(0, JSON.stringify(student));
		window.location.href = "EditStudent.html";
	}
	$scope.preloadRecordsList = student => {
		$window.localStorage.setItem(5, student.client);
		window.location.href = "RecordList.html";
	}
});