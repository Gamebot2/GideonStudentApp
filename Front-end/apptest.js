var app = angular.module('gideonApp', ['ngAnimate']);
/****************\
* LINECHART.HTML *
\****************/
app.controller('chartCtrl', function($scope, $http, $window) {

	// vvvv DATES MANAGEMENT STUFF vvvv
	var zeroDate;
	var n = moment();
	now = {
		month: n.month(),
		year: n.year(),
		date: (n.date() - 1) / n.daysInMonth()
	}
	let getStartDateAt = function(index) { // function that returns a month/year/floating-point-date object from a specified record, for use in plotting points
		var d = moment($scope.records[index].startDate.split(" ")[0]);
		return {
			month: d.month(),
			year: d.year(),
			date: (d.date() - 1) / d.daysInMonth()
		}
	}
	let dateAdd = function(originalDate, addition) { // function that returns a month/year/floating-point-date object a certain number of months after another one of those objects
		var numeral = originalDate.year * 12 + originalDate.month;
		numeral += addition;
		return {
			month: numeral % 12,
			year: Math.trunc(numeral / 12),
			date: 0
		}
	}
	let dateSubtract = function(originalDate, subtraction) { // function that returns a month/year/floating-point-date object a certain number of months prior to another one of those objects
		return dateAdd(originalDate, -1 * subtraction);
	}
	let dateCompare = function(date1, date2) { // function that returns the month difference between two month/year/floating-point-date objects
		return (date1.year - date2.year) * 12 + (date1.month - date2.month) + (date1.date - date2.date);
	}
	// ^^^^ DATES MANAGEMENT STUFF ^^^^

$window.localStorage.getItem(0);
	$scope.students = [];

	$scope.addStudent = function(sId, sName) {
		var newstudent = {
			execute: function() {
				this.expanded = true,
				this.logoDisplay = false,

				this.studentId = sId,
				this.studentName = sName;

				//Retrieves all categories the selected student is working in
				$http.get(`http://localhost:8081/categoriesByStudent?Id=${this.studentId}`)
				.then(function(response) {
					this.categoriesOfStudent = response.data;
					console.log(this);
				});

				//Retrieves the student's grade level and does time calculations
				$http.get(`http://localhost:8081/gradeOfStudent?Id=${this.studentId}`)
				.then(function(response) {
					this.currentGrade = response.data;

					zeroDate = {
						month: 7,
						year: now.year - this.currentGrade - (now.month < 7 ? 1 : 0), // subtract an extra 1 from the year if it's before august
						date: 0
					}
				});

				//Retrieves all the books for use later in y-axis plotting
				$http.get("http://localhost:8081/books")
				.then(function(response) {
					this.allBooks = response.data;
				});

				//Retrieves possible repetition selection options for the selected category
				this.getReps = function() {
					if(this.selectedCategory == "Calculation") {
						this.repOptions = ["1", "2", "3", "4", "5"];
					} else {
						this.repOptions = ["1", "2"];
					}
				}

				// Pre-generation chart management
				var regen = false;
				var exampleChart;
				let myChart = document.getElementById('lineChart');//.getContext('2d');

				//Generates the lineChart based on instructor specifications
				this.generateChart = function() {
					if (this.form.$invalid) { // Ensures form is valid before generation
						this.formStatus = 0;
						this.formStatusText = "Invalid Form";
						return;
					} else {
						this.formStatus = 2;
						this.formStatusText = "Processing...";
					}

					this.until = this.months2 == 0 ? -Math.max(this.monthsF, 0) : this.months2;

					var date1 = dateSubtract(now, this.months);
					var date2 = dateSubtract(now, this.until);

					//// GIANT CHART GENERATION METHOD ////
					$http.get(`http://localhost:8081/recordsById?StudentId=${this.studentId}&Category=${this.selectedCategory}&Months=${this.months}&Reps=${this.selectedRep}&Until=${this.until}`)
					.then(function(response) {
						this.records = response.data;
						
						try {
							var lowestDate = dateCompare(date1, zeroDate); // x-axis bounds
							var highestDate = dateCompare(date2, zeroDate);
							var greatestBook = 0; // y-axis bounds
							var leastBook = 999;

							var currentGradeOffset = 0;
							
							var labelDates = []; // main container of x axis labels, labels are objects containing properties "month", "year", and "grade" (also date, but that's irrelevant here)
							var grades = [];
							var points = []; // container with points: x is date, y is bookid
							var points2 = []; 			// currently contains the best fit line
							var points3 = []; 			// currently contains nothing, but will contain something soon
							var points4 = [];			// currently contains the vertical NOW line


							//// Maps the internal linear scale of the x axis (lowestDate, ... highestDate) with labels containing dates and grades ////
							for(j = lowestDate; j < highestDate; j++) {
								var currentDate = dateAdd(zeroDate, j);
								labelDates.push(currentDate);

								if(currentDate.month == 7) // grade goes up in August = 7
									currentGradeOffset++;
								grades.push(currentGradeOffset); // maps an offset value for the grade relating to each month, starting from 0 and increasing until the present
							}
							for(j = 0; j < labelDates.length; j++)
								labelDates[j].grade = this.currentGrade + grades[j] - currentGradeOffset; // uses the final grade offset and the known current grade to calculate the final grade value for each month
							console.log(labelDates);

							//// Creates a point mapping each record to its respective spot on the x and y axis ////
							var a = 0; // Helps display error message if there is no data, couldn't find a better solution for some reason: this value will increase for every existing record
							for(i = 0; i < this.records.length; i++) {
								if(this.records[i].startDate != null) {
									a++;

									points.push({
										x: dateCompare(getStartDateAt(i), zeroDate),
										y: this.records[i].bookId
									})

									if (this.records[i].bookId > greatestBook)
										greatestBook = this.records[i].bookId;
									if (this.records[i].bookId < leastBook)
										leastBook = this.records[i].bookId;
								}
							}

							if (a <= 0) { // no data check
								this.errorMessage = true;
								this.formStatus = 0;
								this.formStatusText = "Error: No data";
								return;
							}
							else {
								this.errorMessage = false;
							}
							

							//// BEST FIT LINE: least squares method ////
							var metrics = {xmean: 0, ymean: 0, diff: 0, squares: 0};
							metrics.getY = function(x) {
								return metrics.slope * (x - metrics.xmean) + metrics.ymean
							};

							for(b = 0; b < points.length; b++) {
								metrics.xmean += points[b].x;
								metrics.ymean += points[b].y;
							}
							metrics.xmean /= points.length;
							metrics.ymean /= points.length;
							for(b = 0; b < points.length; b++) {
								metrics.diff += (points[b].x - metrics.xmean) * (points[b].y - metrics.ymean);
								metrics.squares += (points[b].x - metrics.xmean) * (points[b].x - metrics.xmean);
							}
							metrics.slope = metrics.diff / metrics.squares;
							points2.push({
								x: lowestDate - 1,
								y: metrics.getY(lowestDate - 1)
							});
							points2.push({
								x: highestDate + 1,
								y: metrics.getY(highestDate + 1)
							});

							if (metrics.getY(highestDate) > greatestBook) // move greatestBook upward if the best fit line goes above the data line
								greatestBook = metrics.getY(highestDate);


							//// NOW LINE: a vertical black line to indicate the current date
							points4.push({
								x: dateCompare(now, zeroDate) - 0.001,
								y: leastBook - 2
							});
							points4.push({
								x: dateCompare(now, zeroDate) + 0.001,
								y: greatestBook + 4
							});


							//// Y-LABEL GENERATION ////
							let labelToBookTitle = function(label, abbreviated) {
								var s = this.allBooks[label-1];
								if (s != null && s != undefined && s.category == this.selectedCategory) {
									var fullLabel;

									if (abbreviated)
										fullLabel = s.abbreviation;
									else
										if (this.selectedCategory == "Comprehension" || this.selectedCategory == "Calculation")
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
								monthAxis: function(label){
									var s = labelDates[label - lowestDate];
									if (s != null && s != undefined)
										return s.month + 1;
								},
								yearAxis: function(label){
									var s = labelDates[label - lowestDate];
									if (s != null && s != undefined) {
										if(s.month == 6)
											return s.year;
										else if (s.month == 0)
											return "|";
									}
								},
								gradeAxis: function(label){
									var s = labelDates[label - lowestDate];
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
								}
							}

							//// CHART SPECIFICATIONS ////
							let chartSpecs = {
								datasets: [
									{
										label: this.studentName,
										data: points,
										backgroundColor: "rgba(255, 0, 0, 0.4)",
										borderColor: "rgba(255, 0, 0, 0.4)",
										fill: false,
										cubicInterpolationMode: 'monotone',
										hitRadius: 30
									}, {
										label: "Best Fit Line",
										data: points2,
										backgroundColor: "rgba(0, 0, 255, 0.4)",
										borderColor: "rgba(0, 0, 255, 0.4)",
										fill: false,
										borderDash: [2],
										lineTension: 0,
										pointRadius: 0
									}, {
										label: "IGL",
										backgroundColor: "rgba(0, 255, 255, 0.4)",
										borderColor: "rgba(0, 255, 255, 0.4)",
										fill: false,
										borderDash: [5],
										lineTension: 0,
										pointRadius: 0
									}, {
										label: "Now",
										data: points4,
										backgroundColor: "rgba(0, 0, 0, 0.2)",
										borderColor: "rgba(0, 0, 0, 0.2)",
										fill: false,
										lineTension: 0,
										pointRadius: 0
									}
								],
								tooltipCallbacks: {
									title:function(tooltipItem, data) {
										return labelToBookTitle(tooltipItem[0].yLabel, false);
									},
									label:function(tooltipItem, data) { // callback function converts x-axis numeral to MM/DD/YYYY formatted string
										var theDate = dateAdd(zeroDate, Math.trunc(tooltipItem.xLabel));

										var daysInMonth = moment(`${theDate.year} ${theDate.month + 1}`, "YYYY MM").daysInMonth();
										theDate.date = Math.round((tooltipItem.xLabel % 1) * daysInMonth) + 1;

										return `started on ${theDate.month + 1}/${theDate.date}/${theDate.year}`;
									}
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
									}
								],
								yAxes: [
									{
										type: 'linear',
										position: 'left',
										display: true,
										scaleLabel: {
											display: true,
											labelString: this.selectedCategory
										},
										ticks: {
											stepSize: 1,
											autoSkip: true,
											autoSkipPadding: 50,
											min: leastBook - 1,
											max: greatestBook + 3,
											lineHeight: 1,
											callback:function(label) {
												return labelToBookTitle(label, true);
											}
										}
									}
								]

							}

							//// BUILD CHART ////
							if (regen)
								exampleChart.destroy();
							exampleChart = new Chart(myChart,{
								type: 'line',
								data:{
									datasets: chartSpecs.datasets
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
									}
								}
							});

							regen = true;

							this.logoDisplay = true;
							this.expanded = false;

							this.formStatus = 1;
							this.formStatusText = "";
						}
						catch (err) {
							console.error(err);
							this.formStatus = 0;
							this.formStatusText = "Error - check console";
						}
					});	
				};
			}
		}
		$scope.students.push(newstudent);
		newstudent.execute();
		
	}

	$scope.addStudent(3, "Ryan Clouston");
});