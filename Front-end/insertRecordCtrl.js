/*
 * INSERT RECORD CONTROLLER
 * Contains the functions and variables used in InsertRecord.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 */


gideonApp.controller('insertRecordCtrl', function($scope, $http, $window){

	// Returns a list of all students for easy name selection	
	$http.get("http://localhost:8081/students")
	.then(function(response) {
		$scope.names = response.data.map(function(student) { 
			return {
				name: student.client, // names contain ids to make sure every name is distinct - the name will be displayed but the id will be used
				id: student.studentId,
			}
		});
	});

	//Returns all books
	$http.get("http://localhost:8081/categories")
	.then(function(response) {
		$scope.categories = response.data;
	});

	//Returns a list of subcategories based on the selected category
	$scope.getSubcategories = function() {
		$http.get(`http://localhost:8081/subcategories?Category=${$scope.selectedCategory}`)
		.then(function(response) {
			$scope.subcategories = response.data;
		});
	}

	//Returns a list of titles based on the selected subCategory
	$scope.getTitles = function() {
		$http.get(`http://localhost:8081/titles?Subcategory=${$scope.selectedSubCategory}`)
		.then(function(response) {
			$scope.titles = response.data;
		});
	}

	// Form submission
	$scope.createRecord = function() {
		if ($scope.form.$valid) {
			$scope.formStatus = 2;
			$scope.formStatusText = "Processing...";

			//Creates JSON for the record based on form data
			var newRecordDetails = JSON.stringify({
				id: 			$scope.client.id,
				category: 		$scope.selectedCategory,
				subcategory: 	$scope.selectedSubCategory,
				title: 			$scope.selectedTitle,
				startDate: 		$scope.startDate,
				testTime: 		$scope.testTime,
				mistakes: 		$scope.mistakes,
				rep: 			$scope.rep,
			});

			//Inserts the record with an HTTP post call
			$http({
				url: 'http://localhost:8081/addRecord',
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data:newRecordDetails,
			}).then(function(response) {
				if (response.data == 0) {
					$scope.formStatus = 1;
					$scope.formStatusText = `Successfully added record for ${$scope.client.name}`;
				} else {
					$scope.formStatus = 0;
					$scope.formStatusText = "Error";
				}
			});
		}
		else {
			$scope.formStatus = 0;
			$scope.formStatusText = "Invalid Form";
		}
	}
});