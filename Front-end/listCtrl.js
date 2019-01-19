/*
 * LIST CONTROLLER
 * Contains the functions and variables used in StudentList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The page requires slots 2, 3, and 4 in the window storage to track the previously used filters during the session. These slots should be unused in every other page, unless they are being used to pre-initialize filter values for this page.
 */


gideonApp.controller('listCtrl', ($scope, $http, $window) => {

	//Preload $scope.students with an initial "loading" value and the toggle button text with its initial state
	$scope.allStudents = [];
	$scope.students = [{
		client: "Loading",
		email: "",
	}];
	$scope.expandedStudentId = -1;

	// SORT BY BUTTONS
	var sortingModes = {
		init() {
			this["nullcheck"] = (s, t) => {
				if (!s && !t) return "0";
				if (!s) return "1";
				if (!t) return "-1";
			}
			this["name"] 		= (s, t) => s.client.localeCompare(t.client);
			this["namedesc"] 	= (s, t) => -this["name"](s, t);
			this["email"] 		= (s, t) => parseInt(this["nullcheck"](s.email, t.email) || s.email.localeCompare(t.email));
			this["emaildesc"] 	= (s, t) => parseInt(this["nullcheck"](s.email, t.email) || -s.email.localeCompare(t.email));
			this["grade"] 		= (s, t) => parseInt(this["nullcheck"](s.grade, t.grade) || parseInt(s.grade.match(/\d+/)) - parseInt(t.grade.match(/\d+/)));
			this["gradedesc"] 	= (s, t) => parseInt(this["nullcheck"](s.grade, t.grade) || -parseInt(s.grade.match(/\d+/)) + parseInt(t.grade.match(/\d+/)));

			delete this.init; // remove this function from the object, to avoid clutter
			return this;
		}
	}.init();
	var currentSortBy = "";

	var dataSwitch = true;
	var refreshStudents = () => {
		var temp = $scope.allStudents;

		if (dataSwitch)
			temp = temp.filter(s => $scope.studentIdsWithData.has(s.studentId));
		if (currentSortBy != "recent")
			temp = temp.sort(sortingModes[currentSortBy]);

		$scope.students = temp;
	}

	$scope.getSortBy = sortBy => {
		if (currentSortBy == sortBy)
			sortBy += "desc";
		currentSortBy = sortBy;

		refreshStudents();
	}
	$scope.getSortBy("recent");
	
	$scope.toggleData = () => {
		dataSwitch = !dataSwitch;
		$scope.toggleButtonText = dataSwitch ? "Display All Students" : "Display Students With Records";
		refreshStudents();
	}
	$scope.toggleData();

	$http.get(`${URL}studentIdsWithRecords`)
	.then(response => {
		$scope.studentIdsWithData = new Set(response.data);
		refreshStudents();
	});

	var getStudents = lim => {
		$http.get(`${URL}listStudents?withData=false&limit=${lim}`)
		.then(response => {
			$scope.allStudents = response.data;
			refreshStudents();
		});
	}
	getStudents(0);
	
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
		$window.localStorage.setItem(5, student.studentId);
		window.location.href = "RecordList.html";
	}
	$scope.removeStudent = student => {
		if (confirm(`Are you sure you want to delete ${student.client} and all of their records? This action cannot be undone!`)) {
			$http.get(`${URL}removeStudent?Id=${student.studentId}`)
			.then(_ => {
				console.log(`Deleted student with id ${student.studentId}`);
				getStudents(0);
			});
		}
	}
});