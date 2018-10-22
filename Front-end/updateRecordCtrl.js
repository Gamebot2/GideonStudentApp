/*
 * UPDATAE RECORD CONTROLLER
 * Contains the functions and variables used in UpdateRecord.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 */


gideonApp.controller('updateRecordCtrl', ($scope, $http, $window) => {

	// initialize Verify
	Verify.setScope($scope);


	//Returns all student names for easy selection
	$http.get(`${URL}students`)
	.then(response => {
		$scope.names = response.data.map(student => student.client);
		$scope.names.unshift("");
		$scope.selectedStudent = "";
	});

	//Retrieves incomplete records for instructors to choose from
	$http.get(`${URL}incompleteRecords`)
	.then(response => {
		$scope.displayRecords = response.data.map(record => {
			let splitDate = record.startDate.split('-').map(d => parseInt(d));
			let year = splitDate[0], month = splitDate[1], day = splitDate[2];

			record.display = `${record.name} started book ${record.bookTitle} on ${month}/${day}/${year} | RecordId: ${record.recordId}`;
			return record;
		});
	});

	// Form submission
	$scope.updateRecord = () => {
		if (!Verify.check())
			return;

		// Updates an incomplete record based on instructor data
		$http.get(`${URL}updateRecord?RecordId=${$scope.selectedRecord.recordId}&EndDate=${$scope.endDate}&TestTime=${$scope.testTime}&Mistakes=${$scope.mistakes}`)
		.then(response => {
			Verify.successIf(response.data == 0, `Successfully updated record for ${$scope.selectedRecord.name}`);
		})
		.catch(Verify.error);
	}
});