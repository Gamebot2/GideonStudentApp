//App for studentList and chart displays
var app = angular.module('studentApp', []);

//Controller used for StudentList.html: mainly to display students who have data for selection
app.controller('studentCtrl', function($scope, $http, $window) {
	//Retrieves students with data
	$http.get("http://localhost:8090/dataStudents")
	.then(function(response) {
		$scope.students = response.data;
	});

	//Function for selecting a student and going to the chart page
	$scope.logStudent = function(id, name) {
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = "lineChart.html"
	}
});

//Controller used for lineChart.html: responsible for creating and displaying students' graphs
app.controller('chartCtrl', function($scope, $http, $window) {
		var logo = document.getElementById("logoDiv");
		logo.style.display = "none";
		$scope.studentName = $window.localStorage.getItem(1);

		//Retrieves all categories the selected student is working in
		$http.get("http://localhost:8090/categoriesByStudent?Id=" + $window.localStorage.getItem(0))
		.then(function(response) {
			$scope.categoriesOfStudent = response.data;
		});

		//Retrieves all data from the student's corresponding record in the database
			$http.get("http://localhost:8090/gradeOfStudent?Id=" + $window.localStorage.getItem(0))
			.then(function(response) {
				$scope.currentGrade = response.data;
			});

		//Retrieves possible repetition selection options for the selected category
		$scope.getReps = function() {
			if($scope.selectedCategory == "Calculation") {
				$scope.repOptions = ["1", "2", "3", "4", "5"];
			} else {
				$scope.repOptions = ["1", "2"]
			}
		}

		//Validates the form before chart data submission to ensure that the month values compare favorably to one another
		$scope.validateForm = function() {
			if($scope.months < $scope.months2) {
				alert("Your month values are inadequate. Please ensure you are selecting an appropriate range.");
			}
		}


		//Generates the lineChart based on instructor specifications
		$scope.generateChart = function() {
				var logo = document.getElementById("logoDiv");
				if (logo.style.display === "none") {
       				logo.style.display = "block";
    			} else {
        			logo.style.display = "none";
    			}

				var selectedStudentId = $window.localStorage.getItem(0);
				var b = document.getElementById("months").value;
				$scope.trueGrade = $scope.currentGrade;
		$http.get("http://localhost:8090/recordsById?StudentId=" + selectedStudentId + "&Category=" + $scope.selectedCategory + "&Months=" + b + "&Reps=" + $scope.selectedRep + "&Until=" + $scope.months2)
		.then(function(response) {
			$scope.records = response.data;
			$scope.first = $scope.records[0];

			let myChart = document.getElementById('lineChart').getContext('2d');

			var dates = [];
			var labelDates = [];
			var labelDatesWithGrades = [];
			var grades = [];
			var books = [];

			//Helps display error message if there is no data, couldn't find a better solution for some reason
			var a = 0;

			var recordDatesCounter = 0;
			var bookCounter = 0;
			var newBooks = [];
			var newDates = [];
			var now = moment().date() + " " + moment().year();

			for(j = $scope.months; j > $scope.months2; j--) {
				var currentMonth = moment().subtract(j, 'months');
				var currentMonthString = currentMonth.month() + 1 + " " + currentMonth.year();
				labelDates.push(currentMonthString);
				var inverseMonth = $scope.months-u;
				var currentInverseMonth = moment().subtract(inverseMonth, 'months').month() + 1;
				if(currentMonth.month() == 8) {
					$scope.trueGrade--;
				}
				grades.push($scope.trueGrade);
			}

			for(var u = 0; u < labelDates.length; u++) {
				var inverseU = labelDates.length-u-1;
				labelDatesWithGrades.push(labelDates[u] + " " + grades[inverseU]);
			}

			var lastBookSequenceLarge;

			for(i = 0; i < $scope.records.length; i++) {
				if($scope.records[i].startDate != null) {
					var d = new Date($scope.records[i].startDate);
					//console.log($scope.records[i]);
					var displayed = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
					dates.push(moment(displayed).format('M YYYY'));
					if($scope.selectedCategory == "Comprehension") {
						books.push($scope.records[i].subcategory + " " + $scope.records[i].bookTitle);
					} else {
						books.push($scope.records[i].bookTitle);
					}
					if(i == $scope.records.length - 1) {
						lastBookSequenceLarge = $scope.records[i].sequenceLarge;
					}
					a++;
				}
			}

			$scope.testSequenceLarge = 26;
			let extraBooks = new Array();
			
			if($scope.testSequenceLarge > lastBookSequenceLarge) {
					$http.get("http://localhost:8090/booksInRange?Category=" + $scope.selectedCategory + "&StartSequence=" + lastBookSequenceLarge + "&EndSequence=" + 25)
					.then(function(response) {
						let booksInRange = response.data;
						//console.log($scope.booksInRange)
						for(y = 0; y < booksInRange.length; y++) {
							extraBooks.push(booksInRange[y].title);
							books.push(booksInRange[y].title);
							console.log(extraBooks);
						}
					});
			}
			console.log(extraBooks);

			var k;
			var firstMonthWithRecord;

			for(k = $scope.months; k > $scope.months2; k--) {
				var currentMonth = moment().subtract(k, 'months');
				var currentMonthString = currentMonth.month() + 1 + " " + currentMonth.year();
				//console.log(currentMonthString);

				var d = new Date($scope.records[recordDatesCounter].startDate);
				var displayed = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
				var recordDateString = moment(displayed).format('M YYYY');
				
				if(k == $scope.months) {
					firstMonthWithRecord = recordDateString;
				}

				if(recordDatesCounter != 0) {
					var d2 = new Date($scope.records[recordDatesCounter-1].startDate);
					var displayed2 = (d2.getMonth()+1) + "/" + d2.getDate() + "/" + d2.getFullYear();
					var recordDateString2 = moment(displayed2).format('M YYYY');
					if(recordDateString2 == recordDateString) {
					currentMonthString = currentMonth.month() + " " + currentMonth.year();
				}
				}

				if(recordDateString == currentMonthString) {
					if($scope.selectedCategory == "Comprehension") {
						newBooks.push($scope.records[bookCounter].subcategory + " " + $scope.records[bookCounter].bookTitle);
					} else {
						newBooks.push($scope.records[bookCounter].bookTitle);
					}
					if(recordDatesCounter != $scope.records.length - 1) {
						recordDatesCounter++;
						bookCounter++;
					}

				} else {
					if($scope.selectedCategory == "Comprehension") {
						newBooks.push($scope.records[bookCounter].subcategory + " " + $scope.records[bookCounter].bookTitle);
					} else {
						newBooks.push($scope.records[bookCounter].bookTitle);
					}
				}
			}


			$scope.errorMessage = true;
			if(a > 0) {
				$scope.errorMessage = false;
			} 	

			Chart.defaults.global.defaultFontSize = 18;
			Chart.defaults.global.defaultFontColor = '#000';

			var newBooks2 = [];
			var newBooks3 = [];
			for(b = 0; b < newBooks.length; b++) {
				newBooks2[b] = newBooks[b];
				newBooks3[b] = newBooks[b];
				if(b == newBooks.length - 1) {
					newBooks3[b] = "3 - A";
				}
			}

			console.log(books);
			

			let exampleChart = new Chart(myChart,{
				type: 'line',
				data:{
					xLabels: labelDatesWithGrades,
					yLabels: books.reverse(),
					datasets:[{
						label: $scope.first.name,
						data: newBooks2,
						backgroundColor: "rgba(255, 0, 0, 0.4)",
						borderColor: "rgba(255, 0, 0, 0.4)",
						fill: false,
						lineTension: 0
					}, {
						//label: "Testing",
						//data: newBooks3,
						backgroundColor: "rgba(0, 0, 255, 0.4)",
						borderColor: "rgba(0, 0, 255, 0.4)",
						fill: false,
						lineTension: 0
					}	
					]
				},
				options: {
					responsive: true,
					title: {
						display: true,
						text: $scope.first.name,
						fontSize: 25
					},
					legend: {
						position: 'right'
					},
					tooltips: {
						enabled: false
					},
					layout: {
						padding: {
							left: 10,
							bottom: 5
						}
					},
					scales: {
						xAxes: [{
							id:"xAxis1",
							scaleLabel: {
								display: false,
								padding: -5
							},
							ticks: {
								dislay: false,
								autoSkip: true,
								callback:function(label){
									var month = label.split(" ")[0];
									var year = label.split(" ")[1];
									var grade = label.split(" ")[2];
									return month;
								}
							}
						}, {
							id: "xAxis2",
							gridLines: {
								display: false,
								drawBorder: true
							},
							scaleLabel: {
								display: false,
								padding: 0
							},
							ticks: {
								autoSkip: false,
								callback:function(label){
									var month = label.split(" ")[0];
									var year = label.split(" ")[1];
									var grade = label.split(" ")[2];
									if(month == "6") {
										return year;
									} else if ( month == "12"){
										return "|";
									}
								},
								maxRotation: 0,
								padding: 0
							}

						}, {
							id: "xAxis3",
							gridLines: {
								display: false,
								drawBorder: true,
								drawOnChartArea: false
							},
							scaleLabel: {
								display: false
							},
							ticks: {
								autoSkip: false,
								callback:function(label){
									var month = label.split(" ")[0];
									var year = label.split(" ")[1];
									var grade = label.split(" ")[2];
									if(month == "2") {
										if(grade == "0") {
											return "Kindergarten";
										} else if(grade == "1") {
											return "1st Grade";
										} else if(grade == "2") {
											return "2nd Grade";
										} else if(grade == "3") {
											return "3rd Grade";
										} else if(grade == "-1") {
											return "Pre-K";
										} else {
											return grade + "th Grade";
										}
									} else if (month == "8") {
										return "|";
									}
								},
								maxRotation: 0,
							}
						}],
						yAxes: [{
							type: 'category',
							position: 'left',
							display: true,
							scaleLabel: {
								display: true,
								labelString: $scope.selectedCategory
							}
						}]
					}
				}
			});
		});	
		};			
	});

//App for inserting data through insertRecord.html
var app2 = angular.module('insertApp', ['ngMaterial']);

	app2.controller('insertCtrl', function($scope, $http){

	//Returns a list of all students for easy name selection	
	$http.get("http://localhost:8090/students")
	.then(function(response) {
		$scope.students = response.data;

		$scope.names = [];
		for(i = 0; i < $scope.students.length; i++) {
			$scope.names.push($scope.students[i].client);
		}

	});

	//Returns a list of subcategories based on the selected category
	$scope.getSubcategories = function() {
		$http.get("http://localhost:8090/subcategories?Category=" + $scope.selectedCategory)
		.then(function(response) {
			console.log(response.data);
			$scope.subcategories = response.data;
		});
	}

	//Returns a list of titles based on the selected subCategory
	$scope.getTitles = function() {
		$http.get("http://localhost:8090/titles?Subcategory=" + $scope.selectedSubCategory)
		.then(function(response) {
			$scope.titles = response.data;
		});
	}

	//Returns all books
	$http.get("http://localhost:8090/books")
	.then(function(response) {
		$scope.books = response.data;
		$scope.categories = [];

		for(i = 0; i < $scope.books.length; i++) {
			if($scope.categories.indexOf($scope.books[i].category) < 0) {
				$scope.categories.push($scope.books[i].category);
			}
		}

		//Creates JSON for the record based on form data
		$scope.createRecord = function() {
			var newRecordDetails = JSON.stringify({
				client: $scope.Client,
				category: $scope.selectedCategory,
				subcategory: $scope.selectedSubCategory,
				title: $scope.selectedTitle,
				startDate: $scope.startDate,
				testTime: $scope.testTime,
				mistakes: $scope.mistakes,
				rep: $scope.rep
			});
			//Inserts the record with an HTTP post call
			$http({
				url: 'http://localhost:8090/addRecord',
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data:newRecordDetails
			}).then(function(response) {
				alert(response.data);
			});
		}

	});
});

//App for updating recordData through updateRecord.html
var app3 = angular.module('updateApp', []);
			
app3.controller('updateCtrl', function($scope, $http){

	//Returns all student names for easy selection
	$http.get("http://localhost:8090/students")
	.then(function(response) {
		$scope.students = response.data;
		$scope.names = [];
		for(i = 0; i < $scope.students.length; i++) {
			$scope.names.push($scope.students[i].client);
		}
	});

	//Retrieves incomplete records for instructors to choose from
	$http.get("http://localhost:8090/incompleteRecords")
	.then(function(response) {
		$scope.records = response.data;
		$scope.displayRecords = [];
		for(i = 0; i < $scope.records.length; i++) {
			var splitDate = $scope.records[i].startDate.split('-');

			var year = splitDate[0];
			var month = splitDate[1];
			var day = splitDate[2];

			//Formats date for readability
			var formattedDate = month + "/" + day + "/" + year;

			$scope.displayRecords.push($scope.records[i].name + ", started book " + $scope.records[i].bookTitle + " on " + formattedDate + " | RecordId: " + $scope.records[i].recordId);
		}
	});

	//Updates an incomplete record based on instructor data
	$scope.updateRecord = function() {
		console.log($scope.endDate);
		$http.get("http://localhost:8090/updateRecord?record=" + $scope.selectedRecord + "&endDate=" + $scope.endDate)
		.then(function(response) {
			window.location.href = "StudentList.html"
		})	
	}
});

//App for inserting a new student through InsertStudent.html
var app4 = angular.module('insertStudentApp', []);

app4.controller('insertStudentCtrl', function($scope, $http) {

	//Creates JSON for the student based on form data
		$scope.createStudent = function() {
			var newStudentDetails = JSON.stringify({
				client: $scope.Client,
				grade: $scope.Grade,
				gender: $scope.Gender
			});
			//Inserts the record with an HTTP post call
			$http({
				url: 'http://localhost:8090/addStudent',
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data:newStudentDetails
			}).then(function(response) {
				alert(response.data);
			});
		}
});