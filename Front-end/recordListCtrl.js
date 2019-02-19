/*
 * RECORD LIST CONTROLLER
 * Contains the functions and variables used in RecordList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The page requires slots 6, 7, and 8 in the window storage to track the previously used filters during the session. These slots should be unused in every other page, unless they are being used to pre-initialize filter values for this page.
 */


gideonApp.controller('recordListCtrl', ($scope, $http, $window) => {

	// INITIALIZE RECORDS
	let allRecords = [{
		title: "Loading"
	}];
	$scope.records = allRecords;

	// FILTER MANAGEMENT
	// The non-optional student filter is the id number. If there is nothing in the window, it should default to a value of 0.
	$scope.studentFilter = parseInt($window.localStorage.getItem(5)) || 0;

	// Optional filters are objects with a "value" property: this is so that each fitler stores a *pointer* to these values for modification
	$scope.categoryFilter = {};
	$scope.repFilter = {};
	$scope.endDateFilter = {};

	// Big Filters dictionary stores information about how filters should be processed.
	const Filters = {
		category: {
			id: 6,								// "id" is the filter's spot in local storage
			model: $scope.categoryFilter,		// "model" is an object pointer where the selected value is being held
			wildcard: "Any",					// "wildcard" is the value for which filtering should not occur
			load(item) {						// "load" converts from the raw local storage data to a useable value
				return item;
			},
			target(record) {					// "target" identifies the part of a record object which must match the filter
				return record.category;
			}
		},
		rep: {
			id: 7,
			model: $scope.repFilter,
			wildcard: "Any",
			load(item) {
				return parseInt(item) || this.wildcard; // If the item is not a number, it has to be the wildcard.
			},
			target(record) {
				return record.rep + ""; // casting to a string because for some reason md-select does not like numerical options
			},
		},
		status: {
			id: 8,
			model: $scope.endDateFilter,
			wildcard: "All",
			load(item) {
				return item;
			},
			target(record) {
				return record.endDateDisplay;
			}
		}
	};

	// Loads all filters from local storage
	Object.keys(Filters).forEach((name) => {
		let filter = Filters[name];

		let opt = $window.localStorage.getItem(filter.id);
		filter.model.value = opt ? filter.load(opt) : filter.wildcard;
	});

	let getRecords = () => {
		$http.get(`${URL}recordsById?StudentId=${$scope.studentFilter}`)
		.then((response) => {
			allRecords = response.data.map((record) => {
				// Note that we're replacing - with / in the dates because of some weird JS date parsing stuff where using - will cause the date to be one day off
				record.startDateDisplay = record.startDate ? new Date(record.startDate.split("-").join("/")).toLocaleDateString() : "";
				record.endDateDisplay = record.endDate ? new Date(record.endDate.split("-").join("/")).toLocaleDateString() : "In Progress";

				switch (record.category) {
					case "Calculation":
						record.displayTitle = record.title;
						break;
					case "Word Problems":
					case "Grammar":
						record.displayTitle = record.category + " " + record.title;
						break;
					case "Comprehension":
						record.displayTitle = record.subcategory + " " + record.title;
						break;
				}

				return record;
			});
			// Apply the filters to the student's records
			$scope.didFilter();
		});
	};

	// Runs when the student is selected
	$scope.didSelectStudent = () => {
		// First, update the storage slot for the student
		$window.localStorage.setItem(5, $scope.studentFilter);

		// Then, load all records for that student
		getRecords();
	};

	// Runs when any optional filter is selected
	$scope.didFilter = () => {
		let allFilters = Object.keys(Filters).map((name) => Filters[name]);
		allFilters.forEach((filt) => $window.localStorage.setItem(filt.id, filt.model.value));

		$scope.records = allRecords.filter((record) => allFilters.every((filt) => [filt.wildcard, filt.target(record)].includes(filt.model.value)));
	};

	// FETCH DATA
	$http.get(`${URL}listStudents?withData=true&limit=0`)
	.then((response) => {
		$scope.students = response.data.map((student) => ({name: student.client, id: student.studentId})).sort((a, b) => a.name.localeCompare(b.name));
		if ($scope.studentFilter === 0) {
			$scope.studentFilter = $scope.students[0].id;
		}
		$scope.didSelectStudent();
	});

	$http.get(`${URL}categories`)
	.then((response) => {
		$scope.categories = response.data;
		$scope.categories.unshift(Filters.category.wildcard);
	});

	$scope.reps = [Filters.rep.wildcard, 1, 2, 3, 4, 5];
	$scope.statuses = [Filters.status.wildcard, "In Progress"];


	// ACCORDION MANAGEMENT
	$scope.expandedRecordId = -1;
	$scope.manageExpansion = (recordId) => {
		if ($scope.expandedRecordId === recordId) {
			$scope.expandedRecordId = -1;
		}
		else {
			$scope.expandedRecordId = recordId;
		}
	};

	$scope.progressChartButton = (record) => {
		$http.get(`${URL}student?Id=${record.studentId}`)
		.then((response) => {
			$window.localStorage.setItem(0, JSON.stringify(response.data));
			$window.localStorage.setItem(1, record.category);
			window.location.href = "LineChart.html";
		});
	};

	$scope.insertRecordButton = () => {
		window.location.href = "InsertRecord.html";
	};

	$scope.editRecordButton = (record) => {
		$window.localStorage.setItem(0, JSON.stringify(record));
		window.location.href = "EditRecord.html";
	};

});