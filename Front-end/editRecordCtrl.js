/*
 * EDIT RECORD CONTROLLER
 * Contains the functions and variables used in EditRecord.html
 * 
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - The application expects there to be a record object in storage slot 0. Make sure this exists before opening EditRecord.html.
 */


gideonApp.controller('editRecordCtrl', ($scope, $http, $window) => {

	// initialize Verify
	Verify.setScope($scope);


	var makeDate = date => {
		if (date)
			return new Date(date.replace(/-/g,"/"));
		else
			return date;
	}

	$scope.record = JSON.parse($window.localStorage.getItem(0));
	$scope.record.startDate = makeDate($scope.record.startDate);
	$scope.record.endDate = makeDate($scope.record.endDate);
	//$scope.display = `${$scope.record.name} started book ${$scope.record.bookTitle} on ${$scope.record.startDate.toLocaleDateString()} | RecordId: ${$scope.record.recordId}`;

	// Returns a list of all students for easy name selection	
	$http.get(`${URL}students`)
	.then(response => {
		$scope.names = response.data.map(student => {
			var option = { 
				name: student.client, // names contain ids to make sure every name is distinct - the name will be displayed but the id will be used
				id: student.studentId,
			}
			if (option.id == $scope.record.studentId) // sets the object as the current one if it is the student which the record refers to
				$scope.client = option;
			return option;
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
	$scope.getSubcategories();

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
	$scope.getTitles();

	//Gathers book information (specifically, the test) for a newly selected title
	$scope.didSetBook = () => {
		if ($scope.record.bookTitle) {
			$http.get(`${URL}book?Category=${$scope.record.category}&Subcategory=${$scope.record.subcategory}&Title=${$scope.record.bookTitle}`)
			.then(response => {
				$scope.record.bookId = response.data.bookId;
				$scope.record.test = response.data.test;
				$scope.record.sequenceLarge = response.data.sequenceLarge;
			});
		}
	}

	// Facilitates the JSON packaging by setting the id property
	$scope.setId = () => {
		$scope.record.studentId = $scope.client.id;
	}

	// Form submission
	$scope.updateRecord = () => {
		if (!Verify.check())
			return;

		// Updates the record with an HTTP post call
		try {
			$http({
				url: `${URL}updateRecord`,
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data: JSON.stringify($scope.record),
			})
			.then(response => {
				if (Verify.successIf(response.data == 0, "Successfully updated."))
					window.location.href = "RecordList.html"; // return back to the list if the update was successful
			})
			.catch(Verify.error);
		} catch (err) {
			Verify.error(err);
		}
	}
});