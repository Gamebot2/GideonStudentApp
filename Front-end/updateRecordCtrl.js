/*
 * UPDATE RECORD CONTROLLER
 * Contains the functions and variables used in InsertRecord.html and EditRecord.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - For InsertRecord, the application expects there to be an integer denoting a selected student id in slot 5. Make sure this exists before opening the page.
 * - For EditRecord, the application expects there to be a record object in storage slot 0. Make sure this exists before opening the page.
 */


gideonApp.controller('updateRecordCtrl', ($scope, $http, $window) => {

	// Initialize Verify
	Verify.setScope($scope);

	if (window.location.href.includes("Edit")) {
		// Load all the edit content: grabs a record from the local storage and converts date strings to Date objects
		let makeDate = (date) => date ? new Date(date.replace(/-/g,"/")) : date;

		$scope.record = JSON.parse($window.localStorage.getItem(0));
		$scope.record.startDate = makeDate($scope.record.startDate);
		$scope.record.endDate = makeDate($scope.record.endDate);
	}
	else {
		// Load all the insert content: create a new record and figure out who was selected
		$scope.record = {};
		$scope.selectedStudentId = parseInt($window.localStorage.getItem(5));

		// Preloads selection boxes with a disabled value (these and only these should start with the letters "Select")
		$scope.subcategories = ["Select a category first"];
		$scope.titles = [{
			title: "Select a subcategory first",
			display: "Select a subcategory first"
		}];
	}

	// Filters the full list of students for md-autocomplete
	$scope.filterStudents = (filterText) =>
		filterText ? $scope.names.filter((s) => s.name.toLowerCase().includes(filterText.toLowerCase())) : $scope.names;

	// Gets a list of all students for easy name selection	
	$http.get(`${URL}students`)
	.then((response) => {
		$scope.names = response.data.map((student) => {
			// Options contain ids to make sure every name is distinct - the name will be displayed but the id will be used
			let option = { 
				name: student.client,
				id: student.studentId
			};
			if (option.id === $scope.record.studentId || option.id === $scope.selectedStudentId) {
				// Sets the object as the current one if it is the student which the record refers to
				$scope.client = option;
			}
			return option;
		});
	});

	// Gets the categories
	$http.get(`${URL}categories`)
	.then((response) => {
		$scope.categories = response.data;
	});

	// Returns a list of subcategories based on the selected category
	$scope.getSubcategories = () => {
		if ($scope.record.category) {
			// If a category has been set, get all of the subcategories in that category
			$http.get(`${URL}subcategories?Category=${$scope.record.category}`)
			.then((response) => {
				$scope.subcategories = response.data;
				// Sets the subcategory to the previously selected option when found, for the edit page
				$scope.record.subcategory = $scope.subcategories.find((c) => c === $scope.record.subcategory) || null;

				$scope.getTitles();
			});
		}
		else {
			// If a category has not been selected, create disabled options indicating to do that first
			$scope.subcategories = ["Select a category first"];
			$scope.record.subcategory = null;
			$scope.getTitles();
		}
	};

	// Returns a list of titles based on the selected subcategory
	$scope.getTitles = () => {
		if ($scope.record.subcategory) {
			// If a subcategory has been set, get all of the titles in that subcategory
			$http.get(`${URL}titles?Subcategory=${$scope.record.subcategory}`)
			.then((response) => {
				$scope.titles = response.data.map((title, index) => ({
					title: title,
					display: `${index + 1}: ${title}`
				}));
				
				// Sets the title to the previously selected option when found, for the edit page
				let targetObj = $scope.titles.find(t => t.title === $scope.record.title);
				$scope.record.title = targetObj ? targetObj.title : null;
				
				$scope.didSetBook();
			});
		}
		else {
			// If a subcategory has not been selected, create disabled options indicating to do that first
			$scope.titles = [{
				title: "Select a subcategory first",
				display: "Select a subcategory first"
			}];
			$scope.record.title = null;
			$scope.didSetBook();
		}
	};

	// Gathers actual book information for a newly selected title
	$scope.didSetBook = () => {
		if ($scope.record.title) {
			$http.get(`${URL}book?Category=${$scope.record.category}&Subcategory=${$scope.record.subcategory}&Title=${$scope.record.title}`)
			.then((response) => {
				$scope.record.bookId = response.data.bookId;
				$scope.record.test = response.data.test;
				$scope.record.sequenceLarge = response.data.sequenceLarge;
			});
		}
	};

	$scope.getSubcategories();

	// Form submission
	let updateRecord = (command) => {
		if (!Verify.check()) {
			return;
		}

		// Manually places the student's id into the record object
		$scope.record.studentId = $scope.client.id;
		console.log($scope.record);

		// Updates the record with an HTTP post call
		$http({
			url: `${URL}${command}Record`,
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			data: JSON.stringify($scope.record)
		})
		.then((response) => {
			Verify.successIf(response.data >= 0, `Successfully ${command}ed record for ${$scope.client.name}`);
			$window.localStorage.setItem(5, $scope.client.id);
		})
		.catch(Verify.error);
	};
	$scope.insertRecord = () => updateRecord("insert");
	$scope.editRecord = () => updateRecord("edit");


	// Delete button
	$scope.removeRecord = () => {
		if (confirm(`Are you sure you want to delete this record? This cannot be undone!`)) {
			$http.get(`${URL}removeRecord?Id=${$scope.record.recordId}`)
			.then((response) => {
				if (Verify.successIf(response.data >= 0, "Deleted.")) {
					// Return back to the list if the delete was successful
					window.location.href = "RecordList.html";
				}
			});
		}
	};
});