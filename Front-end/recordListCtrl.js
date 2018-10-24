/*
 * RECORD LIST CONTROLLER
 * Contains the functions and variables used in RecordList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - Sometimes the page can pre-initialize a value for the student filter on load. To do this, load "true" into storage slot 3 and the name of the student in storage slot 4.
 */


gideonApp.controller('recordListCtrl', ($scope, $http, $window) => {

	var allRecords = [{
		bookTitle: "Loading"
	}];
	$scope.records = allRecords;

	// FILTERING STUFF
	var wildcard = $scope.wildcard = $scope.studentFilter = $scope.categoryFilter = $scope.repFilter = "Any";

	if ($window.localStorage.getItem(3)) {
		$window.localStorage.setItem(3, "");
		$scope.studentFilter = $window.localStorage.getItem(4);
	}

	var didFilter = $scope.didFilter = () => {
		if (!(allRecords.length > 1 && $scope.studentFilter && $scope.categoryFilter))
			return;

		var filtered = allRecords;
		if ($scope.studentFilter != wildcard)
			filtered = filtered.filter(r => r.name == $scope.studentFilter);
		if ($scope.categoryFilter != wildcard)
			filtered = filtered.filter(r => r.category == $scope.categoryFilter);
		if ($scope.repFilter != wildcard)
			filtered = filtered.filter(r => r.rep == $scope.repFilter);
		$scope.records = filtered;
	}

	$http.get(`${URL}students`)
	.then(response => {
		$scope.students = response.data.map(o => o.client);
		$scope.students.unshift(wildcard);
		didFilter();
	});

	$http.get(`${URL}categories`)
	.then(response => {
		$scope.categories = response.data;
		$scope.categories.unshift(wildcard);
		didFilter();
	});


	// FETCH RECORDS
	$http.get(`${URL}records`)
	.then(response => {
		allRecords = response.data.map(record => {
			console.log(record);

			// Note that we're replacing - with / in the dates because of some weird JS date parsing stuff where using - will cause the date to be one day off
			record.startDateDisplay = record.startDate ? new Date(record.startDate.replace(/-/g,"/")).toLocaleDateString() : "";
			record.endDateDisplay = record.endDate ? new Date(record.endDate.replace(/-/g,"/")).toLocaleDateString() : "In Progress";

			return record;
		});
		didFilter();
	});


	// ACCORDION STUFF
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