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

	// initialize Verify
	Verify.setScope($scope);

	if (window.location.href.includes("Edit")) {
		let makeDate = (date) => date ? new Date(date.replace(/-/g,"/")) : date;

		$scope.record = JSON.parse($window.localStorage.getItem(0));
		console.log($scope.record);
		$scope.record.startDate = makeDate($scope.record.startDate);
		$scope.record.endDate = makeDate($scope.record.endDate);
	}
	else {
		$scope.record = {};
		$scope.selectedStudentId = parseInt($window.localStorage.getItem(5));

		// Preloads selection boxes with a disabled value (these and only these should start with the letters "Select")
		$scope.subcategories = ["Select a category first"];
		$scope.titles = [{
			title: "Select a subcategory first",
			display: "Select a subcategory first"
		}];
	}

	$scope.filterStudents = (filterText) =>
		filterText
			? $scope.names.filter((s) => s.name.toLowerCase().split(" ").some((n) => n.startsWith(filterText.toLowerCase())))
			: $scope.names;

	// Returns a list of all students for easy name selection	
	$http.get(`${URL}students`)
	.then((response) => {
		$scope.names = response.data.map((student) => {
			let option = { 
				name: student.client, // names contain ids to make sure every name is distinct - the name will be displayed but the id will be used
				id: student.studentId
			};
			if (option.id === $scope.record.studentId) { // sets the object as the current one if it is the student which the record refers to
				$scope.client = option;
			}
			return option;
		});
	});

	$http.get(`${URL}categories`)
	.then((response) => {
		$scope.categories = response.data;
	});

	//Returns a list of subcategories based on the selected category
	$scope.getSubcategories = () => {
		if ($scope.record.category) {
			$http.get(`${URL}subcategories?Category=${$scope.record.category}`)
			.then((response) => {
				$scope.subcategories = response.data;
				$scope.record.subcategory = $scope.subcategories.find(c => c === $scope.record.subcategory) || null;

				$scope.getTitles();
			});
		}
		else {
			$scope.subcategories = ["Select a category first"];
			$scope.record.subcategory = null;
			$scope.getTitles();
		}
	};

	//Returns a list of titles based on the selected subCategory
	$scope.getTitles = () => {
		if ($scope.record.subcategory) {
			$http.get(`${URL}titles?Subcategory=${$scope.record.subcategory}`)
			.then((response) => {
				$scope.titles = response.data.map((title, index) => ({
					title: title,
					display: `${index + 1}: ${title}`
				}));
				let targetObj = $scope.titles.find(t => t.title === $scope.record.title);
				$scope.record.title = targetObj ? targetObj.title : null;
				$scope.didSetBook();
			});
		}
		else {
			$scope.titles = [{
				title: "Select a subcategory first",
				display: "Select a subcategory first"
			}];
			$scope.record.title = null;
			$scope.didSetBook();
		}
	};

	//Gathers book information (specifically, the test) for a newly selected title
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
			url: `${URL}${command}`,
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			data: JSON.stringify($scope.record)
		})
		.then((response) => {
			Verify.successIf(response.data >= 0, `Successfully updated record for ${$scope.client.name}`);
			$window.localStorage.setItem(5, $scope.client.id);
		})
		.catch(Verify.error);
	};
	$scope.insertRecord = () => updateRecord("addRecord");
	$scope.editRecord = () => updateRecord("updateRecord");


	// Delete button
	$scope.removeRecord = () => {
		if (confirm(`Are you sure you want to delete this record? This cannot be undone!`)) {
			$http.get(`${URL}removeRecord?Id=${$scope.record.recordId}`)
			.then((response) => {
				if (Verify.successIf(response.data >= 0, "Deleted.")) {
					window.location.href = "RecordList.html"; // return back to the list if the delete was successful
				}
			});
		}
	};
});