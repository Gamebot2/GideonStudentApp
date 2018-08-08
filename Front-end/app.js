//App for studentList and chart displays
var app = angular.module('gideonApp', ['ngAnimate']);

//Controller used for StudentList.html: mainly to display students who have data for selection
app.controller('studentCtrl', function($scope, $http, $window) {
	//Retrieves students with data
	console.log("start");
	$scope.getStudents = function() {
		$http.get("http://localhost:8080/" + ($scope.dataOn ? "dataStudents" : "students"))
		.then(function(response) {
			$scope.students = response.data;
			console.log("end");
		});
		$scope.toggleButtonText = $scope.dataOn ? "Display All Students" : "Display Students with Records";
	}

	$scope.toggleData = function() {
		$scope.dataOn = !$scope.dataOn;
		$scope.getStudents();
	}

	$scope.dataOn = false;
	$scope.active = false;
	$scope.getStudents();

	$scope.manageExpansion = function(student) {
		if ($scope.expandedStudent == student)
			$scope.expandedStudent = null;
		else
			$scope.expandedStudent = student;
	}

	//Function for selecting a student and going to the chart page
	$scope.logStudent = function(id, name) {
		console.log(name);
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = "lineChart.html";
	}

	$scope.editStudent = function(id, name) {
		console.log(name);
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = "EditStudent.html";
	}
});

//Controller used for lineChart.html: responsible for creating and displaying students' graphs
app.controller('chartCtrl', function($scope, $http, $window) {
		var logo = document.getElementById("logoDiv");
		logo.style.display = "none";
		$scope.studentName = $window.localStorage.getItem(1);

		//Retrieves all categories the selected student is working in
		$http.get("http://localhost:8080/categoriesByStudent?Id=" + $window.localStorage.getItem(0))
		.then(function(response) {
			$scope.categoriesOfStudent = response.data;
		});

		//Retrieves the student's grade level
		$http.get("http://localhost:8080/gradeOfStudent?Id=" + $window.localStorage.getItem(0))
		.then(function(response) {
			$scope.currentGrade = response.data;
		});

		$http.get("http://localhost:8080/books")
		.then(function(response) {
			$scope.allBooks = response.data;
		});

		//Retrieves possible repetition selection options for the selected category
		$scope.getReps = function() {
			if($scope.selectedCategory == "Calculation") {
				$scope.repOptions = ["1", "2", "3", "4", "5"];
			} else {
				$scope.repOptions = ["1", "2"];
			}
		}

		//Validates the form before chart data submission to ensure that the month values compare favorably to one another
		$scope.validateForm = function() {
			if($scope.selectedCategory == undefined)
				alert("Please select a category.");
			else if($scope.months == undefined || $scope.months2 == undefined || $scope.months <= $scope.months2)
				alert("Your month values are invalid. Be sure each number is between 1 and 60, and that the first number is earlier than the second.");
			else if($scope.selectedRep == undefined)
				alert("Please select the included repetitions.");
			else
				$scope.generateChart();
		}

		var regen = false;
		var exampleChart;

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
				var currentGradeOffset = 0;

			//// GIANT CHART GENERATION METHOD ////
			$http.get("http://localhost:8080/recordsById?StudentId=" + selectedStudentId + "&Category=" + $scope.selectedCategory + "&Months=" + b + "&Reps=" + $scope.selectedRep + "&Until=" + $scope.months2)
			.then(function(response) {
				$scope.records = response.data;
				$scope.first = $scope.records[0];
				
				let getStartDateAt = function(index) { // function that draws a M YYYY date string from a specified record, for use in plotting points
					var d = new Date($scope.records[index].startDate);
					var displayed = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
					return moment(displayed).format('M YYYY');
				}
				let getCurrentMonthString = function(subtraction) { // function that returns a M YYYY date string from a certain number of months in the past
					var currentMonth = moment().subtract(subtraction, 'months');
					return currentMonth.month() + 1 + " " + currentMonth.year();
				}

				let myChart = document.getElementById('lineChart').getContext('2d');
				
				var labelDatesWithGrades = []; // main container of x axis labels, formatted M YYYY G
				var labelDates = [];
				var grades = [];
				
				var dates = []; // containers for relevant data from each of the student's records
				var books = [];

				var now = moment().date() + " " + moment().year();

				//// Calculates x-axis label data, to be formatted later ////
				for(j = $scope.months; j >= $scope.months2; j--) {
					var currentMonthString = getCurrentMonthString(j);
					labelDates.push(currentMonthString);

					if(currentMonthString.split(" ")[0] == "8")
						currentGradeOffset++;
					grades.push(currentGradeOffset); // maps an offset value for the grade relating to each month, starting from 0 and increasing until the present
				}
				for(var u = 0; u < labelDates.length; u++) {
					var actualGrade = $scope.currentGrade + grades[u] - currentGradeOffset; // uses the final grade offset and the known current grade to calculate the final grade value for each month
					labelDatesWithGrades.push(labelDates[u] + " " + actualGrade);
				}

				//// Extracts the date and book number for each of the student's records ////
				var a = 0; // Helps display error message if there is no data, couldn't find a better solution for some reason: this value will increase for every existing record
				for(i = 0; i < $scope.records.length; i++) {
					if($scope.records[i].startDate != null) {
						a++;

						dates.push(getStartDateAt(i));
						books.push($scope.records[i].bookId);
					}
				}
				$scope.errorMessage = (a <= 0);
				console.log(dates + " " + books);

				//// Goes across the x axis and determines what book the student was working on at the start of that month using the dates and book titles of the records ////
				var recordCounter = 0;
				var newBooks = [];
				for(var k = $scope.months; k >= $scope.months2; k--) {
					var currentMonthString = getCurrentMonthString(k);
					newBooks.push(books[recordCounter]);

					while (dates[recordCounter + 1] == currentMonthString && recordCounter != $scope.records.length - 1)
						recordCounter++;
				}

				var newBooks2 = []; // currently contains an exact copy of the point data previously calculated
				var newBooks3 = []; // currently unused test modification of the data
				for(b = 0; b < newBooks.length; b++) {
					newBooks2[b] = newBooks[b];
					newBooks3[b] = newBooks[b];
					if(b == newBooks.length - 1) {
						newBooks3[b] = "3 - A";
					}
				}

				//// CHART SPECS ////
				Chart.defaults.global.defaultFontSize = 18;
				Chart.defaults.global.defaultFontColor = '#000';

				if (regen)
					exampleChart.destroy();
				exampleChart = new Chart(myChart,{
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
							lineTension: 0,
							hitRadius: 30
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
									maxRotation: 0,
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
										if(month == "7") {
											return year;
										} else if ( month == "1"){
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
										var grade = parseInt(label.split(" ")[2]);
										if(month == "2") {
											if(grade == 0) {
												return "Kindergarten";
											} else if(grade == 1) {
												return "1st Grade";
											} else if(grade == 2) {
												return "2nd Grade";
											} else if(grade == 3) {
												return "3rd Grade";
											} else if(grade <= -1) {
												return "Pre-K";
											} else {
												return grade + "th Grade";
											}
										} else if (month == "8") {
											return "|";
										}
									},
									maxRotation: 0
								}
							}],
							yAxes: [{
								type: 'linear',
								position: 'left',
								display: true,
								scaleLabel: {
									display: true,
									labelString: $scope.selectedCategory
								},
								ticks: {
									stepSize: 1,
									autoSkip: false,
									callback:function(label) {
										if ($scope.selectedCategory == "Comprehension")
											return $scope.allBooks[label-1].subcategory + " " + $scope.allBooks[label-1].title;
										else
											return $scope.allBooks[label-1].title;
									}
								}
							}]
						}
					}
				});

				regen = true;
			});	
		};
	
	});

//App for inserting data through insertRecord.html
app.controller('insertCtrl', function($scope, $http){

	//Returns a list of all students for easy name selection	
	$http.get("http://localhost:8080/students")
	.then(function(response) {
		$scope.students = response.data;

		$scope.names = [];
		for(i = 0; i < $scope.students.length; i++) {
			var nameWithId = { name: $scope.students[i].client, id: $scope.students[i].studentId };
			$scope.names.push(nameWithId); // names contain ids to make sure every name is distinct - the name will be displayed but the id will be used
		}

	});

	//Returns a list of subcategories based on the selected category
	$scope.getSubcategories = function() {
		$http.get("http://localhost:8080/subcategories?Category=" + $scope.selectedCategory)
		.then(function(response) {
			console.log(response.data);
			$scope.subcategories = response.data;
		});
	}

	//Returns a list of titles based on the selected subCategory
	$scope.getTitles = function() {
		$http.get("http://localhost:8080/titles?Subcategory=" + $scope.selectedSubCategory)
		.then(function(response) {
			$scope.titles = response.data;
		});
	}

	//Returns all books
	$http.get("http://localhost:8080/books")
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
				id: $scope.client,
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
				url: 'http://localhost:8080/addRecord',
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
app.controller('updateCtrl', function($scope, $http){

	//Returns all student names for easy selection
	$http.get("http://localhost:8080/students")
	.then(function(response) {
		$scope.students = response.data;
		$scope.names = [];
		for(i = 0; i < $scope.students.length; i++) {
			$scope.names.push($scope.students[i].client);
		}
	});

	//Retrieves incomplete records for instructors to choose from
	$http.get("http://localhost:8080/incompleteRecords")
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
		$http.get("http://localhost:8080/updateRecord?record=" + $scope.selectedRecord + "&endDate=" + $scope.endDate + "&testTime=" + $scope.testTime + "&mistakes=" + $scope.mistakes)
		.then(function(response) {
			window.location.href = "StudentList.html"
		})	
	}
});

//App for inserting a new student through InsertStudent.html
app.controller('insertStudentCtrl', function($scope, $http) {

	//Creates JSON for the student based on form data
	$scope.createStudent = function() {
		var newStudentDetails = JSON.stringify({
			client: $scope.Client,
			grade: $scope.Grade,
			gender: $scope.Gender
		});
		//Inserts the record with an HTTP post call
		$http({
			url: 'http://localhost:8080/addStudent',
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

//App for editing a student
app.controller('editStudentCtrl', function($scope, $http, $window) {
	$http.get("http://localhost:8080/student?Id=" + $window.localStorage.getItem(0))
	.then(function(response) {
		$scope.student = response.data;
		$scope.Id = $scope.student.studentId;
		$scope.Client = $scope.student.client;
		$scope.Email = $scope.student.email;
		$scope.Phone = $scope.student.phone;
		$scope.Address = $scope.student.address;
		$scope.Grade = $scope.student.grade;
		$scope.Gender = $scope.student.gender;
		$scope.CurrentPasses = $scope.student.currentPasses;
	});

	$scope.updateStudent = function() {
		$http.get("http://localhost:8080/updateStudent?studentId=" + $scope.Id + "&client=" + $scope.Client + "&email=" + $scope.Email + "&phone=" + $scope.Phone + "&address=" + $scope.Address + "&grade=" + $scope.Grade + "&gender=" + $scope.Gender + "&currentPasses=" + $scope.CurrentPasses)
		.then(function(response) {
			window.location.href = "StudentList.html"
		});
	}
});