/*
 * INSERT RECORD CONTROLLER
 * Contains the functions and variables used in InsertRecord.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 */


gideonApp.controller('insertRecordCtrl', ($scope, $http, $window) => {

	// initialize Verify
	Verify.setScope($scope);

	$scope.record = {};
	var selectedStudentId = parseInt($window.localStorage.getItem(5));

	// Preloads selection boxes with a disabled value (these and only these should start with the letters "Select")
	$scope.subcategories = ["Select a category first"];
	$scope.titles = [{title: "Select a subcategory first", display: "Select a subcategory first"}];

	// Facilitates the JSON packaging by setting the id property
	$scope.setId = () => {
		if ($scope.client)
			$scope.record.id = $scope.client.id;
	}

	// Returns a list of all students for easy name selection	
	$http.get(`${URL}students`)
	.then(response => {
		$scope.names = response.data.map(student => {
			let obj = { 
				name: student.client, // names contain ids to make sure every name is distinct - the name will be displayed but the id will be used
				id: student.studentId,
			}

			if (student.studentId == selectedStudentId) {
				$scope.client = obj;
				$scope.setId();
			}

			return obj;
		});
	});

	$http.get(`${URL}categories`)
	.then(response => {
		$scope.categories = response.data;
	});

	//Returns a list of subcategories based on the selected category
	$scope.getSubcategories = () => {
		$http.get(`${URL}subcategories?Category=${$scope.record.category}`)
		.then(response => {
			$scope.subcategories = response.data;
		});
	}

	//Returns a list of titles based on the selected subCategory
	$scope.getTitles = () => {
		$http.get(`${URL}titles?Subcategory=${$scope.record.subcategory}`)
		.then(response => {
			$scope.titles = response.data.map((o,i) => ({
				title: o,
				display: `${i+1}: ${o}`
			}));
		});
	}
	

	// Form submission
	$scope.createRecord = () => {
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
			.then(response => {
				Verify.successIf(response.data >= 0, `Successfully added record for ${$scope.client.name}`);
				$window.localStorage.setItem(5, $scope.client.id);
			})
			.catch(Verify.error);
		}
		catch (err) {
			Verify.error(err);
		}
	}
});