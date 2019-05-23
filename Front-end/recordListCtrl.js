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

	// Big Filters dictionary stores information about how filters should be processed. Metadata for each filter object:
	// - id: the filter's spot in local storage
	// - model: the object which holds the selected value (changing the model changes the actual object)
	// - wildcard: the value of the filter which corresponds to no filtering
	// - load: conversion method from raw local storage data to a useable value
	// - target: takes a record and returns the part of the object which must match the filter
	const Filters = {
		category: {
			id: 6,
			model: $scope.categoryFilter,
			wildcard: "Any",
			load(item) {
				return item;
			},
			target(record) {
				return record.category;
			}
		},
		rep: {
			id: 7,
			model: $scope.repFilter,
			wildcard: "Any",
			load(item) {
				// If the item is not a number, set it to the wildcard
				return parseInt(item) || this.wildcard;
			},
			target(record) {
				// Casting to a string because for some reason md-select does not like numerical options
				return record.rep + "";
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
		filter.model.value = opt ? filter.load(opt) : filter.wildcard; // If there is nothing in local storage, just use the wildcard
	});

	let getRecords = () => {
		$http.get(`${URL}recordsById?StudentId=${$scope.studentFilter}`)
		.then((response) => {
			allRecords = response.data.map((record) => {
				// Note that we're replacing '-' with '/' in the dates because of some weird JS date parsing stuff where using '-' will cause the date to be one day off - it's bizarre
				record.startDateDisplay = record.startDate ? new Date(record.startDate.split("-").join("/")).toLocaleDateString() : "";
				record.endDateDisplay = record.endDate ? new Date(record.endDate.split("-").join("/")).toLocaleDateString() : "In Progress";

				// Hard-coded display formats for each category
				switch (record.category) {
					case "Math":
						record.displayTitle = record.title;
						break;
					case "Reading":
						record.displayTitle = record.subcategory + " " + record.title;
						break;
					default:
						record.displayTitle = record.category + " " + record.title;
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
		$scope.records = allRecords.filter((record) => allFilters.every((filt) => [filt.wildcard, filt.target(record)].includes(filt.model.value)));
	
		// Puts the new values of the filters into local storage to be remembered next time
		allFilters.forEach((filt) => $window.localStorage.setItem(filt.id, filt.model.value));
	};

	// FETCH STUDENT DATA
	$http.get(`${URL}listStudents?withData=true&limit=0`)
	.then((response) => {
		$scope.students = response.data.map((student) => ({name: student.client, id: student.studentId})).sort((a, b) => a.name.localeCompare(b.name));

		// If the student filter isn't a student in the list, default to the first student
		if ($scope.studentFilter != 0 && $scope.students.every((student) => student.id != $scope.studentFilter)) {
			$scope.studentFilter = 0;
		}
		if ($scope.studentFilter === 0) {
			$scope.studentFilter = $scope.students[0].id;
		}

		$scope.didSelectStudent();
	});

	// Set filter options for categories
	$http.get(`${URL}categories`)
	.then((response) => {
		$scope.categories = response.data;
		$scope.categories.unshift(Filters.category.wildcard);
	});

	// Set filter options for the other things
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

	// ACCORDION BUTTONS
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