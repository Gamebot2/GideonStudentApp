/******************\
* SITEWIDE MODULE  *
\******************/
var app = angular.module('gideonApp', ['ngAnimate']);


// MULTITEST.HTML
var newApp = angular.module('testApp', ['ngAnimate']);

app.controller('testCtrl', function($scope) {
	
	$scope.students = [];

	for (var i = 0; i < 5; i++) {
		$scope.students.push({
			one: "ping",
			two: "pong",
			switch: function() {
				var temp = this.one;
				this.one = this.two;
				this.two = temp;
			}
		});
	}

});






/******************\
* STUDENTLIST.HTML *
\******************/
app.controller('studentCtrl', function($scope, $http, $window) {

	$scope.getStudents = function() {
		$http.get(`http://localhost:8081/${$scope.dataOn ? "dataStudents" : "students"}`)
		.then(function(response) {
			$scope.students = response.data;
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
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = "LineChart.html";
	}

	$scope.editStudent = function(id, name) {
		$window.localStorage.setItem(0, id);
		$window.localStorage.setItem(1, name);
		window.location.href = "EditStudent.html";
	}
});


/****************\
* LINECHART.HTML *
\****************/
app.controller('chartCtrl', function($scope, $http, $window) {

	$scope.studentId = $window.localStorage.getItem(0);
	$scope.studentName = $window.localStorage.getItem(1);

	// Pre-generation chart management
	var regen = false;
	$scope.expanded = true;
	$scope.logoDisplay = false;
	var exampleChart;
	let myChart = document.getElementById('lineChart').getContext('2d');

	//Retrieves all categories the selected student is working in
	$http.get(`http://localhost:8081/categoriesByStudent?Id=${$scope.studentId}`)
	.then(function(response) {
		$scope.categoriesOfStudent = response.data;
	});

	//Retrieves the student's grade level and does time calculations
	$http.get(`http://localhost:8081/gradeOfStudent?Id=${$scope.studentId}`)
	.then(function(response) {
		$scope.currentGrade = response.data;
		Dates.setZeroDate($scope.currentGrade);
	});

	//Retrieves all the books for use later in y-axis plotting
	$http.get("http://localhost:8081/books")
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

	//Generates the lineChart based on instructor specifications
	$scope.generateChart = function() {
		// Ensures form is valid before generation
		if ($scope.form.$invalid) { 
			$scope.formStatus = 0;
			$scope.formStatusText = "Invalid Form";
			return;
		} else {
			$scope.formStatus = 2;
			$scope.formStatusText = "Processing...";
		}

		if ($scope.months2 == 0 && Number.isInteger($scope.monthsF)) {
			$scope.until = -Math.max($scope.monthsF, 0)
		} else {
			$scope.until = $scope.months2;
		}

		//// GIANT CHART GENERATION METHOD ////
		$http.get(`http://localhost:8081/recordsForChart?StudentId=${$scope.studentId}&Category=${$scope.selectedCategory}&Months=${$scope.months}&Until=${$scope.until}&Reps=${$scope.selectedRep}`)
		.then(function(response) {
			$scope.records = response.data;
			
			try {
				var lowestDate = Dates.inputToDate($scope.months); // x-axis bounds
				var highestDate = Dates.inputToDate($scope.until);
				var greatestBook = 0; // y-axis bounds
				var leastBook = 999;
				
				var xAxisLabels = []; // main container of x axis labels, labels are objects containing properties "month", "year", and "grade" (also date, but that's irrelevant here)
				var dataPoints = []; 		// data points: x is date, y is bookid, main graph plot
				var bestFitPoints = []; 	// best fit line: will contain two points outside the horizontal range of the graph
				var iglPoints = []; 		// will contain the international goal line, or IGL
				var nowPoints = [];			// vertical NOW line: will contain two points with nearly the same x value denoting the current date


				//// Maps the internal linear scale of the x axis (lowestDate, ... highestDate) with labels containing dates and grades ////
				for(j = lowestDate; j < highestDate; j++) {
					var theLabel = Dates.dateAdd(Dates.zeroDate, j);
					theLabel.grade = Dates.modtrunc(j / 12);

					xAxisLabels.push(theLabel);
				}

				//// DATA POINTS: Creates a point mapping each record to its respective spot on the x and y axis ////
				var a = 0; // Helps display error message if there is no data, couldn't find a better solution for some reason: this value will increase for every existing record
				$scope.records.forEach(function(record) {
					if(record.startDate != null) {
						a++;

						dataPoints.push({
							x: Dates.dateCompare(Dates.toDateObject(record.startDate), Dates.zeroDate),
							y: record.bookId,
						});

						greatestBook = Math.max(record.bookId, greatestBook); // adjust y-axis bounds
						leastBook = Math.min(record.bookId, leastBook);
					}
				});
				// no data check
				if (a <= 0) { 
					$scope.errorMessage = true;
					$scope.formStatus = 0;
					$scope.formStatusText = "Error: No data";
					return;
				}
				else {
					$scope.errorMessage = false;
				}
				

				//// BEST FIT LINE: least squares method ////
				var metrics = {
					init() {
						this.xmean = dataPoints.map(p => p.x).reduce((a, b) => a + b) / dataPoints.length; // average x
						this.ymean = dataPoints.map(p => p.y).reduce((a, b) => a + b) / dataPoints.length; // average y

						this.getDiff = p => (p.x - this.xmean) * (p.y - this.ymean);      // numerator of formula, per term
						this.getSquares = p => (p.x - this.xmean) * (p.x - this.xmean);   // denominator of formula, per term

						this.diffSum = dataPoints.map(p => this.getDiff(p)).reduce((a, b) => a + b);            // numerator of formula, summation
						this.squaresSum = dataPoints.map(p => this.getSquares(p)).reduce((a, b) => a + b);      // denominator of formula, summation

						this.slope = this.diffSum / this.squaresSum;					// complete formula
						this.getY = x => this.slope * (x - this.xmean) + this.ymean;	// point-slope form linear equation

						delete this.init; // remove this function from the object, to avoid clutter
						return this;
					}
				}.init();

				bestFitPoints.push({
					x: lowestDate - 1,
					y: metrics.getY(lowestDate - 1),
				}, {
					x: highestDate + 1,
					y: metrics.getY(highestDate + 1),
				});
				// move greatestBook upward if the best fit line goes above the data line
				greatestBook = Math.max(metrics.getY(highestDate), greatestBook);


				//// NOW LINE: a vertical black line to indicate the current date ////
				nowPoints.push({
					x: Dates.dateCompare(Dates.now, Dates.zeroDate) - 0.001,
					y: leastBook - 2,
				}, {
					x: Dates.dateCompare(Dates.now, Dates.zeroDate) + 0.001,
					y: greatestBook + 4,
				});


				//// Y-LABEL GENERATION ////
				let labelToBookTitle = function(label, abbreviated) {
					var s = $scope.allBooks[label-1];
					if (s != null && s != undefined && s.category == $scope.selectedCategory) {
						var fullLabel;

						if (abbreviated)
							fullLabel = s.abbreviation;
						else
							if ($scope.selectedCategory == "Comprehension" || $scope.selectedCategory == "Calculation")
								fullLabel = `${s.subcategory} - ${s.title}`;
							else
								fullLabel = s.title;

						return fullLabel;
					}
				}


				//// CHART DEFAULTS ////
				Chart.defaults.global.defaultFontSize = 16;
				Chart.defaults.global.defaultFontColor = '#000';

				//// X AXES CALLBACKS ////
				let xAxesSpecs = {
					monthAxis(label) {
						var s = xAxisLabels[label - lowestDate];
						if (s != null && s != undefined)
							return s.month + 1;
					},
					yearAxis(label) {
						var s = xAxisLabels[label - lowestDate];
						if (s != null && s != undefined) {
							if(s.month == 6)
								return s.year;
							else if (s.month == 0)
								return "|";
						}
					},
					gradeAxis(label) {
						var s = xAxisLabels[label - lowestDate];
						if (s != null && s != undefined) {
							if(s.month == 1) {
								if(s.grade == 0)
									return "Kindergarten";
								else if(s.grade == 1)
									return "1st Grade";
								else if(s.grade == 2)
									return "2nd Grade";
								else if(s.grade == 3)
									return "3rd Grade";
								else if(s.grade <= -1)
									return "Pre-K";
								else
									return `${grade}th Grade`;
							} else if (s.month == 7) {
								return "|";
							}
						}
					},
				}

				//// CHART SPECIFICATIONS ////
				let chartSpecs = {
					datasets: [
						{
							label: $scope.studentName,
							data: dataPoints,
							backgroundColor: "rgba(255, 0, 0, 0.4)",
							borderColor: "rgba(255, 0, 0, 0.4)",
							fill: false,
							cubicInterpolationMode: 'monotone',
							hitRadius: 30
						}, {
							label: "Best Fit Line",
							data: bestFitPoints,
							backgroundColor: "rgba(0, 0, 255, 0.4)",
							borderColor: "rgba(0, 0, 255, 0.4)",
							fill: false,
							borderDash: [2],
							lineTension: 0,
							pointRadius: 0
						}, {
							label: "IGL",
							data: iglPoints,
							backgroundColor: "rgba(0, 255, 255, 0.4)",
							borderColor: "rgba(0, 255, 255, 0.4)",
							fill: false,
							borderDash: [5],
							lineTension: 0,
							pointRadius: 0
						}, {
							label: "Now",
							data: nowPoints,
							backgroundColor: "rgba(0, 0, 0, 0.2)",
							borderColor: "rgba(0, 0, 0, 0.2)",
							fill: false,
							lineTension: 0,
							pointRadius: 0
						},
					],
					tooltipCallbacks: {
						title(tooltipItem, data) {
							return labelToBookTitle(tooltipItem[0].yLabel, false);
						},
						// callback function converts x-axis numeral to MM/DD/YYYY formatted string
						label(tooltipItem, data) { 
							var theDate = Dates.getDateObject(tooltipItem.xLabel);
							return `started on ${theDate.month + 1}/${theDate.date}/${theDate.year}`;
						},
					},
					xAxes: [
						{
							id:"xAxis1",
							type: 'linear',
							scaleLabel: {
								display: false,
								padding: -5
							},
							ticks: {
								dislay: false,
								stepSize: 1,
								autoSkip: true,
								min: lowestDate,
								max: highestDate,
								maxRotation: 0,
								callback: xAxesSpecs.monthAxis
							}
						}, {
							id: "xAxis2",
							type: 'linear',
							gridLines: {
								display: false,
								drawBorder: true
							},
							scaleLabel: {
								display: false,
								padding: 0
							},
							ticks: {
								stepSize: 1,
								autoSkip: false,
								min: lowestDate,
								max: highestDate,
								maxRotation: 0,
								padding: 0,
								callback: xAxesSpecs.yearAxis
							}

						}, {
							id: "xAxis3",
							type: 'linear',
							gridLines: {
								display: false,
								drawBorder: true,
								drawOnChartArea: false
							},
							scaleLabel: {
								display: false
							},
							ticks: {
								stepSize: 1,
								autoSkip: false,
								min: lowestDate,
								max: highestDate,
								maxRotation: 0,
								callback: xAxesSpecs.gradeAxis
							}
						},
					],
					yAxes: [
						{
							type: 'linear',
							position: 'left',
							display: true,
							scaleLabel: {
								display: true,
								labelString: $scope.selectedCategory
							},
							ticks: {
								stepSize: 1,
								autoSkip: true,
								autoSkipPadding: 50,
								min: leastBook - 1,
								max: greatestBook + 3,
								lineHeight: 1,
								callback(label) {
									return labelToBookTitle(label, true);
								}
							}
						},
					],

				}

				//// BUILD CHART ////
				if (regen)
					exampleChart.destroy();
				exampleChart = new Chart(myChart, {
					type: 'line',
					data:{
						datasets: chartSpecs.datasets,
					},
					options: {
						responsive: true,
						title: {
							display: false
						},
						legend: {
							position: 'top'
						},
						tooltips: {
							enabled: true,
							callbacks: chartSpecs.tooltipCallbacks
						},
						layout: {
							padding: {
								top: 10,
								bottom: 10
							}
						},
						scales: {
							xAxes: chartSpecs.xAxes,
							yAxes: chartSpecs.yAxes
						},
					},
				});

				regen = true;
				$scope.logoDisplay = true;
				$scope.expanded = false;

				$scope.formStatus = 1;
				$scope.formStatusText = "";
			}
			catch (err) {
				console.error(err);
				$scope.formStatus = 0;
				$scope.formStatusText = "Error - check console";
			}
		});	
	};

});


/*******************\
* INSERTRECORD.HTML *
\*******************/
app.controller('insertCtrl', function($scope, $http, $window){

	//Returns a list of all students for easy name selection	
	$http.get("http://localhost:8081/students")
	.then(function(response) {
		$scope.students = response.data;

		$scope.names = [];
		$scope.students.forEach(function(student) {
			// names contain ids to make sure every name is distinct - the name will be displayed but the id will be used
			$scope.names.push({ 
				name: student.client,
				id: student.studentId
			}); 
		});

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

	//Returns all books
	$http.get("http://localhost:8081/categories")
	.then(function(response) {
		$scope.categories = response.data;
	});

	//Creates JSON for the record based on form data
	$scope.createRecord = function() {
		if ($scope.form.$valid) {
			$scope.formStatus = 2;
			$scope.formStatusText = "Processing...";

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


/*******************\
* UPDATERECORD.HTML *
\*******************/		
app.controller('updateCtrl', function($scope, $http, $window){

	//Returns all student names for easy selection
	$http.get("http://localhost:8081/students")
	.then(function(response) {
		$scope.students = response.data;
		$scope.names = [];
		for(i = 0; i < $scope.students.length; i++) {
			$scope.names.push($scope.students[i].client);
		}
	});

	//Retrieves incomplete records for instructors to choose from
	$http.get("http://localhost:8081/incompleteRecords")
	.then(function(response) {
		$scope.records = response.data;
		$scope.displayRecords = [];

		$scope.records.forEach(function(record) {
			var splitDate = record.startDate.split('-');

			var year = parseInt(splitDate[0]);
			var month = parseInt(splitDate[1]);
			var day = parseInt(splitDate[2]);

			var startDate = new Date(year, month-1, day).toISOString();		// the date representation that the application uses
			var formattedDate = `${month}/${day}/${year}`;					// the date representation that is readable for humans

			var displayRecord = `${record.name} started book ${record.bookTitle} on ${formattedDate} | RecordId: ${record.recordId}`;

			$scope.displayRecords.push({
				name: record.name,
				id: record.recordId,
				date: startDate,
				display: displayRecord, // "display" for the shown selections, everything else is actual data
			}); 
		});
	});

	//Updates an incomplete record based on instructor data
	$scope.updateRecord = function() {
		if ($scope.form.$valid) {
			$scope.formStatus = 2;
			$scope.formStatusText = "Processing...";

			$http.get(`http://localhost:8081/updateRecord?recordId=${$scope.selectedRecord.id}&endDate=${$scope.endDate}&testTime=${$scope.testTime}&mistakes=${$scope.mistakes}`)
			.then(function(response) {
				if (response.data == 0) {
					$scope.formStatus = 1;
					$scope.formStatusText = `Successfully updated record for ${$scope.selectedRecord.name}`;
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


/********************\
* INSERTSTUDENT.HTML *
\********************/
app.controller('insertStudentCtrl', function($scope, $http, $window) {

	//Creates JSON for the student based on form data
	$scope.createStudent = function() {
		if ($scope.form.$valid){
			$scope.formStatus = 2;
			$scope.formStatusText = "Processing...";

			var newStudentDetails = JSON.stringify({
				client: $scope.Client,
				grade: 	$scope.Grade,
				gender: $scope.Gender,
			});
			//Inserts the record with an HTTP post call
			$http({
				url: 'http://localhost:8081/addStudent',
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data:newStudentDetails,
			}).then(function(response) {
				if (response.data == 0) {
					$scope.formStatus = 1;
					$scope.formStatusText = `Successfully added ${$scope.Client}`;
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


/******************\
* EDITSTUDENT.HTML *
\******************/
app.controller('editStudentCtrl', function($scope, $http, $window) {
	$http.get(`http://localhost:8081/student?Id=${$window.localStorage.getItem(0)}`)
	.then(function(response) {
		$scope.student = response.data;
		$scope.Id 				= $scope.student.studentId;
		$scope.Client 			= $scope.student.client;
		$scope.Email 			= $scope.student.email;
		$scope.Phone 			= $scope.student.phone;
		$scope.Address 			= $scope.student.address;
		$scope.Grade 			= $scope.student.grade;
		$scope.Gender 			= $scope.student.gender;
		$scope.CurrentPasses 	= $scope.student.currentPasses;
	});

	$scope.updateStudent = function() {
		if ($scope.form.$valid) {
			$scope.formStatus = 2;
			$scope.formStatusText = "Processing...";

			var newStudentDetails = JSON.stringify({
				id: 			$scope.Id,
				client:			$scope.Client,
				email: 			$scope.Email,
				phone: 			$scope.Phone,
				address: 		$scope.Address,
				grade: 			$scope.Grade,
				gender: 		$scope.Gender,
				currentPasses: 	$scope.CurrentPasses,
			});

			$http({
				url: 'http://localhost:8081/updateStudent',
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				data:newStudentDetails,
			}).then(function(response) {
				if (response.data == 0) {
					window.location.href = "StudentList.html";
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