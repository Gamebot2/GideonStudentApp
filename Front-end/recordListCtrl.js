/*
 * RECORD LIST CONTROLLER
 * Contains the functions and variables used in RecordList.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('recordListCtrl', ($scope, $http, $window) => {

	var studentId = $window.localStorage.getItem(0), studentName = $window.localStorage.getItem(1);

	var allRecords = [{
		bookTitle: "Loading"
	}];
	$scope.records = allRecords;

	$scope.expandedRecordId = -1;
	$scope.manageExpansion = recordId => {
		if ($scope.expandedRecordId == recordId)
			$scope.expandedRecordId = -1;
		else
			$scope.expandedRecordId = recordId;
	}

	var didFilter = () => {
		if (!(allRecords.length > 1 && $scope.studentFilter && $scope.categoryFilter))
			return;

		var filtered = allRecords;
		if ($scope.studentFilter != " ")
			filtered = filtered.filter(r => r.name == $scope.studentFilter);
		if ($scope.categoryFilter != " ")
			filtered = filtered.filter(r => r.category == $scope.categoryFilter);
		if ($scope.repFilter != "All")
			filtered = filtered.filter(r => r.rep == $scope.repFilter);
		$scope.records = filtered;
	}
	$scope.didFilter = didFilter;

	$http.get(`${URL}students`)
	.then(response => {
		$scope.students = response.data.map(o => o.client);
		$scope.students.unshift(" ");
		$scope.studentFilter = studentName;
		didFilter();
	});

	$http.get(`${URL}categories`)
	.then(response => {
		$scope.categories = response.data;
		$scope.categories.unshift(" ");
		$scope.categoryFilter = " ";
		didFilter();
	});

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


	$scope.repFilter = "All";

});