/*
 * LIST CONTROLLER
 * Contains the functions and variables used in StudentList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('listCtrl', ($scope, $http, $window) => {

	//Preload $scope.students with an initial "loading" value and the toggle button text with its initial state
	$scope.allStudents = [];
	$scope.students = [{
		client: "Loading",
		email: ""
	}];

	$scope.expandedStudentId = -1;
	var currentSortBy = "";
	var dataSwitch = true;

<<<<<<< HEAD
	// SORTING FUNCTIONS CONTAINER (uses some magic)
	var sortingModes = {
		init() {
			this["nullsort"] = (s, t, comp) => { // nullsort conducts a custom sorting method on strings but brings all null or empty strings to the bottom, stablely
				if (!s && !t) return 0;
				else if (!s)  return 1;
				else if (!t)  return -1;
				else		  return comp(s, t);
			}
			this["name"] 		= (s, t) => this["nullsort"](s.client, t.client, (u, v) => u.localeCompare(v));
			this["namedesc"] 	= (s, t) => this["nullsort"](s.client, t.client, (u, v) => -u.localeCompare(v));
			this["email"] 		= (s, t) => this["nullsort"](s.email,  t.email,  (u, v) => u.localeCompare(v));
			this["emaildesc"] 	= (s, t) => this["nullsort"](s.email,  t.email,  (u, v) => -u.localeCompare(v));
			this["grade"] 		= (s, t) => this["nullsort"](s.grade,  t.grade,  (u, v) => parseInt(u.match(/\d+/)) - parseInt(v.match(/\d+/)));
			this["gradedesc"] 	= (s, t) => this["nullsort"](s.grade,  t.grade,  (u, v) => -parseInt(u.match(/\d+/)) + parseInt(v.match(/\d+/)));
=======
	// SORT BY BUTTONS
	const sortingModes = {
		init() {
			this["nullcheck"] = (s, t) => {
				if (!s && !t) { return "0"; }
				if (!s) { return "1"; }
				if (!t) { return "-1"; }
			};
			this["name"] 		= (s, t) => s.client.localeCompare(t.client);
			this["namedesc"] 	= (s, t) => -this["name"](s, t);
			this["email"] 		= (s, t) => parseInt(this["nullcheck"](s.email, t.email) || s.email.localeCompare(t.email));
			this["emaildesc"] 	= (s, t) => parseInt(this["nullcheck"](s.email, t.email) || -s.email.localeCompare(t.email));
			this["grade"] 		= (s, t) => parseInt(this["nullcheck"](s.grade, t.grade) || parseInt(s.grade.match(/\d+/)) - parseInt(t.grade.match(/\d+/)));
			this["gradedesc"] 	= (s, t) => parseInt(this["nullcheck"](s.grade, t.grade) || -parseInt(s.grade.match(/\d+/)) + parseInt(t.grade.match(/\d+/)));
>>>>>>> master

			delete this.init; // remove this function from the object, to avoid clutter
			return this;
		}
	}.init();
<<<<<<< HEAD
	
	// RELOAD LIST OF STUDENTS based on sort and data filters
	var refreshStudents = () => {
		var temp = $scope.allStudents.slice();

		if (dataSwitch)
			temp = temp.filter(s => $scope.studentIdsWithData.has(s.studentId));
		if (sortingModes[currentSortBy] != null && sortingModes[currentSortBy] != undefined)
=======
	let currentSortBy = "";

	let dataSwitch = true;
	let refreshStudents = () => {
		let temp = $scope.allStudents;

		if (dataSwitch) {
			temp = temp.filter((student) => $scope.studentIdsWithData.has(student.studentId));
		}
		if (currentSortBy != "recent") {
>>>>>>> master
			temp = temp.sort(sortingModes[currentSortBy]);
		}

		$scope.students = temp;
	};

<<<<<<< HEAD
	// CHANGE SORT METHOD
	$scope.getSortBy = sortBy => {
		if (currentSortBy.startsWith(sortBy))
			sortBy += "desc";
		if (currentSortBy == sortBy)
			sortBy = "";
		currentSortBy = sortBy;

		refreshStudents();
	}
	$scope.getSortBy("");
=======
	$scope.getSortBy = (sortBy) => {
		if (currentSortBy === sortBy) {
			sortBy += "desc";
		}
		currentSortBy = sortBy;

		refreshStudents();
	};
	$scope.getSortBy("recent");
>>>>>>> master
	
	// TOGGLE DATA FILTER
	$scope.toggleData = () => {
		dataSwitch = !dataSwitch;
		$scope.toggleButtonText = dataSwitch ? "Display All Students" : "Display Students With Records";
		refreshStudents();
	};
	$scope.toggleData();

	// GET SET OF STUDENTS WHO HAVE DATA
	$http.get(`${URL}studentIdsWithRecords`)
	.then((response) => {
		$scope.studentIdsWithData = new Set(response.data);
		refreshStudents();
	});

<<<<<<< HEAD
	// GET STUDENTS (note: currently exists in a function to allow for pagination later)
	var getStudents = lim => {
=======
	let getStudents = (lim) => {
>>>>>>> master
		$http.get(`${URL}listStudents?withData=false&limit=${lim}`)
		.then((response) => {
			$scope.allStudents = response.data;
			refreshStudents();
		});
	};
	getStudents(0);
	
	// ACCORDION MANAGEMENT
	$scope.manageExpansion = (studentId) => {
		if ($scope.expandedStudentId === studentId) {
			$scope.expandedStudentId = -1;
		}
		else {
			$scope.expandedStudentId = studentId;
		}
	};

	// ACCORDION BUTTONS
	$scope.lineChartButton = (student) => {
		$window.localStorage.setItem(0, JSON.stringify(student));
		window.location.href = "LineChart.html";
	};
	$scope.editStudentButton = (student) => {
		$window.localStorage.setItem(0, JSON.stringify(student));
		window.location.href = "EditStudent.html";
	};
	$scope.preloadRecordsList = (student) => {
		$window.localStorage.setItem(5, student.studentId);
		window.location.href = "RecordList.html";
<<<<<<< HEAD
	}
	$scope.removeStudent = student => {
		console.log("Removed student with ID " + student.studentId);
		$http.get(`${URL}removeStudents?Id=` + student.studentId)
		.then(response => {
			refreshStudents();
		});
	}
=======
	};
>>>>>>> master
});