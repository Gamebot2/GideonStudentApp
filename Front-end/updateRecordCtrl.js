/*
 * UPDATAE RECORD CONTROLLER
 * Contains the functions and variables used in UpdateRecord.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 */


gideonApp.controller('updateRecordCtrl', function($scope, $http, $window){

	// initialize Verify
	Verify.setScope($scope);


	//Returns all student names for easy selection
	$http.get(`${URL}students`)
	.then(function(response) {
		$scope.names = response.data.map(student => student.client);
	});

	//Retrieves incomplete records for instructors to choose from
	$http.get(`${URL}incompleteRecords`)
	.then(function(response) {
		$scope.records = response.data;
		var displayRecords = [];

		$scope.records.forEach(function(record) {
			var splitDate = record.startDate.split('-').map(d => parseInt(d));

			var year = splitDate[0], month = splitDate[1], day = splitDate[2];

			var startDate = new Date(year, month-1, day).toISOString();		// the date representation that the application uses
			var formattedDate = `${month}/${day}/${year}`;					// the date representation that is readable for humans

			var displayRecord = `${record.name} started book ${record.bookTitle} on ${formattedDate} | RecordId: ${record.recordId}`;

			displayRecords.push({
				name: record.name,
				id: record.recordId,
				date: startDate,
				display: displayRecord, // "display" for the shown selections, everything else is actual data
			}); 
		});

		$scope.displayRecords = displayRecords;
	});

	// Form submission
	$scope.updateRecord = function() {
		if (!Verify.check())
			return;

		// Updates an incomplete record based on instructor data
		$http.get(`${URL}updateRecord?RecordId=${$scope.selectedRecord.id}&EndDate=${$scope.endDate}&TestTime=${$scope.testTime}&Mistakes=${$scope.mistakes}`)
		.then(function(response) {
			Verify.successIf(response.data == 0, `Successfully updated record for ${$scope.selectedRecord.name}`);
		})
		.catch(Verify.error);
	}
});