/*
 * INSERT RECORD CONTROLLER
 * Contains the functions and variables used in InsertRecord.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - Disabled options in selections will end with "#". Anything meant to be selected should not contain "#".
 */


gideonApp.controller('insertRecordCtrl', function($scope, $http, $window){

	// initialize Verify
	Verify.setScope($scope);

	$scope.record = {};


	// Preloads selection boxes with a disabled value
	$scope.names = [{name: "Loading#"}];
	$scope.categories = ["Loading#"];
	$scope.subcategories = ["Select a category first#"];
	$scope.titles = ["Select a subcategory first#"];

	// Returns a list of all students for easy name selection	
	$http.get(`${URL}students`)
	.then(function(response) {
		$scope.names = response.data.map(function(student) { 
			return {
				name: student.client, // names contain ids to make sure every name is distinct - the name will be displayed but the id will be used
				id: student.studentId,
			}
		});
	});

	$http.get(`${URL}categories`)
	.then(function(response) {
		$scope.categories = response.data;
	});

	//Returns a list of subcategories based on the selected category
	$scope.getSubcategories = function() {
		$http.get(`${URL}subcategories?Category=${$scope.record.category}`)
		.then(function(response) {
			$scope.subcategories = response.data;
			console.log($scope.subcategories);
		});
	}

	//Returns a list of titles based on the selected subCategory
	$scope.getTitles = function() {
		$http.get(`${URL}titles?Subcategory=${$scope.record.subcategory}`)
		.then(function(response) {
			$scope.titles = response.data;
		});
	}

	// Facilitates the JSON packaging by setting the id property
	$scope.setId = function() {
		$scope.record.id = $scope.client.id;
	}

	// Form submission
	$scope.createRecord = function() {
		if (!Verify.check())
			return;
		
		//Inserts the record with an HTTP post call
		try {
			$http({
				url: `${URL}addRecord`,
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data: JSON.stringify($scope.record),
			})
			.then(function(response) {
				Verify.successIf(response.data == 0, `Successfully added record for ${$scope.client.name}`);
			})
			.catch(Verify.error);
		}
		catch (err) {
			Verify.error(err);
		}
	}
});