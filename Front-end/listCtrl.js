/*
 * LIST CONTROLLER
 * Contains the functions and variables used in StudentList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The page requires slots 2, 3, and 4 in the window storage to track the previously used filters during the session. These slots should be unused in every other page, unless they are being used to pre-initialize filter values for this page.
 */


gideonApp.controller('listCtrl', ($scope, $http, $window) => {

	var dataSwitch = false;

	//Preload $scope.students with an initial "loading" value and the toggle button text with its initial state
	$scope.students = [{
		client: "Loading",
		email: "",
	}];
	$scope.expandedStudentId = -1;

	var getStudents = () => {
		$http.get(`${URL}listStudents?withData=${dataSwitch}&limit=0`)
		.then(response => {
			$scope.students = response.data;
		});
		$scope.toggleButtonText = dataSwitch ? "Display All Students" : "Display Students With Records";
	}
	getStudents();

	$scope.toggleData = () => {
		dataSwitch = !dataSwitch;
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