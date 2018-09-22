/*
 * CHART CONTROLLER
 * Contains the functions and variables used in LineChart.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Dates" is defined in momentbymonth.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - The application expects there to be the id and name of a student in the local storage of the window. Make sure these exist before opening LineChart.html.
 */


// Custom extension to the Math class: clamp returns the median of three numbers, modN and truncN are the same but loop around for negative numbers
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
Math.modN = (x, n) => (x % n + n) % n;
Math.truncN = (x) => Math.trunc(x) - (x < 0 ? 1 : 0);


gideonApp.controller('chartCtrl', function($scope, $http, $window) {

	// Fetch relevant information from the window
	$scope.studentId = $window.localStorage.getItem(0);
	$scope.studentName = $window.localStorage.getItem(1);

	// Pre-generation chart management
	var regen = false;
	$scope.expanded = true;
	$scope.logoDisplay = false;

	var exampleChart;
	let myChart = document.getElementById('lineChart').getContext('2d');

	// initialize Verify
	Verify.setScope($scope);

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




	//// GIANT CHART GENERATION METHOD ////
	// "response" is intended to be a list of records drawn from an http call
	let gen = function(response) {
		$scope.records = response.data;
			
		var lowestDate   = Dates.inputToDate($scope.months), // x-axis bounds
			highestDate  = Dates.inputToDate($scope.until),
		    greatestBook = 0, // y-axis bounds
			leastBook    = 999;
		
		var xAxisLabels 	= [], // main container of x axis labels, labels are objects containing properties "month", "year", and "grade" (also date, but that's irrelevant here)
			dataPoints 		= [], 		// data points: x is date, y is bookid, main graph plot
			bestFitPoints 	= [], 		// best fit line: will contain two points outside the horizontal range of the graph
			iglPoints 		= [], 		// will contain the international goal line, or IGL
			nowPoints 		= [];		// vertical NOW line: will contain two points with nearly the same x value denoting the current date

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
		if (Verify.errorIf(a <= 0, "No data")) { 
			$scope.errorMessage = true;
			return;
		}
		else
			$scope.errorMessage = false;
		

		//// Maps the internal linear scale of the x axis (lowestDate, ... highestDate) with labels containing dates and grades ////
		for(j = lowestDate; j < highestDate; j++) {
			var theLabel = Dates.dateAdd(Dates.zeroDate, j);
			theLabel.grade = Math.truncN(j / 12);

			xAxisLabels.push(theLabel);
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
		greatestBook = Math.clamp(greatestBook, Math.trunc(metrics.getY(highestDate)), $scope.allBooks.length);


		//// FINALIZE Y-AXIS BOUNDS ///
		var s = $scope.allBooks[leastBook-1];
		leastBook = s.bookId - (s.sequence - 1); // bottom bound is the start of a sequence
		s = $scope.allBooks[greatestBook-1];
		greatestBook = s.bookId + (s.sequenceLength - s.sequence) + 1; // top bound is the start of a sequence


		//// NOW LINE: a vertical black line to indicate the current date ////
		nowPoints.push({
			x: Dates.dateCompare(Dates.now, Dates.zeroDate) - 0.001,
			y: leastBook - 1,
		}, {
			x: Dates.dateCompare(Dates.now, Dates.zeroDate) + 0.001,
			y: greatestBook + 1,
		});


		//// CHART DEFAULTS ////
		Chart.defaults.global.defaultFontSize = 16;
		Chart.defaults.global.defaultFontColor = '#000';

		//// CALLBACKS ////
		let callbacks = {
			// callback for the x axis: displaying month numbers
			monthXAxis(label) {
				var s = xAxisLabels[label - lowestDate];
				if (s != null && s != undefined)
					return s.month + 1;
			},
			// callback for the x axis: displaying year numbers
			yearXAxis(label) {
				var s = xAxisLabels[label - lowestDate];
				if (s != null && s != undefined) {
					if(s.month == 6)
						return s.year;
					else if (s.month == 0)
						return "|";
				}
			},
			// callback for the x axis: displaying grade values
			gradeXAxis(label) {
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
							return `${s.grade}th Grade`;
					} else if (s.month == 7) {
						return "|";
					}
				}
			},
			// callback for the y axis: displaying book sequences
			bookYAxis(label) {
				var s = $scope.allBooks[label-1];
				if (s != null && s != undefined && s.category == $scope.selectedCategory && s.sequenceLength > 1) { // if the sequence length is 1, there's no good display for the y-axis, so just ignore that sequence
					if (s.sequence == 1)
						return "_________";
					else {
						var middle = Math.trunc(s.sequenceLength / 2) + 1;
						if (s.sequence == Math.max(middle, 2)) // ensures that the sequence number in the middle is at least 2 (and thus not 1, which would be the edge)
							return s.sequenceName

						return " ";
					}
				}
			},
			// callback for the tooltip: displaying book titles
			titleTooltip(tooltipItem, data) {
				var s = $scope.allBooks[tooltipItem[0].yLabel-1];
				if (s != null && s != undefined && s.category == $scope.selectedCategory) {
					if ($scope.selectedCategory == "Comprehension" || $scope.selectedCategory == "Calculation")
						return `${s.subcategory} - ${s.title}`;
					else
						return s.title;
				}
			},
			// callback for the tooltip: displaying exact dates
			descTooltip(tooltipItem, data) {
				var theDate = Dates.getDateObject(tooltipItem.xLabel);
				return `started on ${theDate.month + 1}/${theDate.date}/${theDate.year}`;
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
					hitRadius: 30,
				}, {
					label: "Best Fit Line",
					data: bestFitPoints,
					backgroundColor: "rgba(0, 0, 255, 0.4)",
					borderColor: "rgba(0, 0, 255, 0.4)",
					fill: false,
					borderDash: [2],
					lineTension: 0,
					pointRadius: 0,
				}, {
					label: "IGL",
					data: iglPoints,
					backgroundColor: "rgba(0, 255, 255, 0.4)",
					borderColor: "rgba(0, 255, 255, 0.4)",
					fill: false,
					borderDash: [5],
					lineTension: 0,
					pointRadius: 0,
				}, {
					label: "Now",
					data: nowPoints,
					backgroundColor: "rgba(0, 0, 0, 0.2)",
					borderColor: "rgba(0, 0, 0, 0.2)",
					fill: false,
					lineTension: 0,
					pointRadius: 0,
				},
			],
			tooltipCallbacks: {
				title: callbacks.titleTooltip,
				label: callbacks.descTooltip,
			},
			xAxes: [
				{
					id:"xAxis1",
					type: 'linear',
					scaleLabel: {
						display: false,
						padding: -5,
					},
					ticks: {
						dislay: false,
						stepSize: 1,
						autoSkip: true,
						min: lowestDate,
						max: highestDate,
						maxRotation: 0,
						callback: callbacks.monthXAxis,
					},
				}, {
					id: "xAxis2",
					type: 'linear',
					gridLines: {
						display: false,
						drawBorder: true,
					},
					scaleLabel: {
						display: false,
						padding: 0,
					},
					ticks: {
						stepSize: 1,
						autoSkip: false,
						min: lowestDate,
						max: highestDate,
						maxRotation: 0,
						padding: 0,
						callback: callbacks.yearXAxis,
					},

				}, {
					id: "xAxis3",
					type: 'linear',
					gridLines: {
						display: false,
						drawBorder: true,
						drawOnChartArea: false,
					},
					scaleLabel: {
						display: false,
					},
					ticks: {
						stepSize: 1,
						autoSkip: false,
						min: lowestDate,
						max: highestDate,
						maxRotation: 0,
						callback: callbacks.gradeXAxis,
					},
				},
			],
			yAxes: [
				{
					id: "yAxis1",
					type: 'linear',
					position: 'left',
					display: true,
					gridLines: {

					},
					scaleLabel: {
						display: true,
						labelString: $scope.selectedCategory,
					},
					ticks: {
						stepSize: 1,
						autoSkip: true,
						autoSkipPadding: 50,
						min: leastBook,
						max: greatestBook,
						lineHeight: 1,
						callback: callbacks.bookYAxis,
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

		Verify.remove();
	}


	// Form submission: generates the line chart based on user specifications
	$scope.generateChart = function() {
		// Ensures form is valid before generation
		if (!Verify.check())
			return;

		// try-catch block ensures that any major errors that may arise from the complex and probably buggy logic of the gen() function gets written out in html
		try {
			if ($scope.months2 == 0 && Number.isInteger($scope.monthsF))
				$scope.until = -Math.max($scope.monthsF, 0)
			else
				$scope.until = $scope.months2;

			$http.get(`http://localhost:8081/recordsForChart?StudentId=${$scope.studentId}&Category=${$scope.selectedCategory}&Months=${$scope.months}&Until=${$scope.until}&Reps=${$scope.selectedRep}`)
			.then(gen)
			.catch(function(err) {
				console.error(err);
				Verify.error();
			});
		}
		catch (err) {
			console.error(err);
			Verify.error();
		}
	};



});