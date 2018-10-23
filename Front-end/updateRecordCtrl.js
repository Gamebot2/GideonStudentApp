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
	});

	//Retrieves incomplete records for instructors to choose from
	$http.get(`${URL}incompleteRecords`)
	.then(response => {
		$scope.displayRecords = response.data.map(record => {
			let d = new Date(record.startDate.replace(/-/g,"/"));
			
			return { // "display" for the shown selections, everything else is actual data
				name: record.name,
				id: record.recordId,
				date: record.startDate,
				display: `${record.name} started book ${record.bookTitle} on ${d.toLocaleDateString()} | RecordId: ${record.recordId}`,
			};
		});
	});

	// Form submission
	$scope.updateRecord = () => {
		if (!Verify.check())
			return;

		// Updates an incomplete record based on instructor data
		$http.get(`${URL}updateRecord?RecordId=${$scope.selectedRecord.id}&EndDate=${$scope.endDate}&TestTime=${$scope.testTime}&Mistakes=${$scope.mistakes}`)
		.then(response => {
			Verify.successIf(response.data == 0, `Successfully updated record for ${$scope.selectedRecord.name}`);
		})
		.catch(Verify.error);
	}
});