/*
 * RECORD LIST CONTROLLER
 * Contains the functions and variables used in RecordList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The page requires slots 5, 6, 7, and 8 in the window storage to track the previously used filters during the session. These slots should be unused in every other page, unless they are being used to pre-initialize filter values for this page.
 */


gideonApp.controller('recordListCtrl', ($scope, $http, $window) => {

	// INITIALIZE RECORDS
	var allRecords = [{
		bookTitle: "Loading"
	}];
	$scope.records = allRecords;

	// FILTER MANAGEMENT
	$scope.studentFilter = {};
	$scope.categoryFilter = {};
	$scope.repFilter = {};

	var Filters = {
		"student": {
			id: 5,
			model: $scope.studentFilter,
			wildcard: "Any",
			load(item) {
				return item;
			},
			target(record) {
				return record.name;
			},
		},
		"category": {
			id: 6,
			model: $scope.categoryFilter,
			wildcard: "Any",
			load(item) {
				return item;
			},
			target(record) {
				return record.category;
			},
		},
		"rep": {
			id: 7,
			model: $scope.repFilter,
			wildcard: "Any",
			load(item) {
				return parseInt(item) || this.wildcard;
			},
			target(record) {
				return record.rep;
			},
		},
	};

	for (var name in Filters) {
		var filter = Filters[name];

		var opt = $window.localStorage.getItem(filter.id);
		if (opt)
			filter.model.value = filter.load(opt);
		else
			filter.model.value = filter.wildcard;
	}

	var didFilter = $scope.didFilter = () => {
		var filtered = allRecords;
		for (var name in Filters) {
			var filter = Filters[name];

			// First, update the storage slots
			$window.localStorage.setItem(filter.id, filter.model.value);

			// Then, do the actual filtering
			if (filter.model.value != filter.wildcard)
				filtered = filtered.filter(r => filter.target(r) == filter.model.value);
		};
		
		
		$scope.records = filtered;
	}

	// FETCH DATA
	$http.get(`${URL}students`)
	.then(response => {
		$scope.students = response.data.map(o => o.client);
		$scope.students.unshift(Filters["student"].wildcard);
	});

	$http.get(`${URL}categories`)
	.then(response => {
		$scope.categories = response.data;
		$scope.categories.unshift(Filters["category"].wildcard);
	});

	$scope.reps = [Filters["rep"].wildcard, 1, 2, 3, 4, 5];

	$http.get(`${URL}records`)
	.then(response => {
		allRecords = response.data.map(record => {
			// Note that we're replacing - with / in the dates because of some weird JS date parsing stuff where using - will cause the date to be one day off
			record.startDateDisplay = record.startDate ? new Date(record.startDate.replace(/-/g,"/")).toLocaleDateString() : "";
			record.endDateDisplay = record.endDate ? new Date(record.endDate.replace(/-/g,"/")).toLocaleDateString() : "In Progress";

			return record;
		});
		didFilter();
	});


	// ACCORDION MANAGEMENT
	$scope.expandedRecordId = -1;
	$scope.manageExpansion = recordId => {
		if ($scope.expandedRecordId == recordId)
			$scope.expandedRecordId = -1;
		else
			$scope.expandedRecordId = recordId;
	}

	$scope.editRecordButton = record => {
		$window.localStorage.setItem(0, JSON.stringify(record));
		window.location.href = "EditRecord.html";
	}

});