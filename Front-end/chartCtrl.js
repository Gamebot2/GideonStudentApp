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
Math.truncN = (x) => Number.isInteger(x) ? x : Math.trunc(x) - (x < 0 ? 1 : 0);


gideonApp.controller('chartCtrl', function($scope, $http, $window) {

	// Fetch relevant information from the window
	$scope.studentId = $window.localStorage.getItem(0);
	$scope.studentName = $window.localStorage.getItem(1);

	// Pre-generation chart management
	var allBooks = [];
	$scope.expanded = true;

	var exampleChart;
	let myChart = document.getElementById('lineChart').getContext('2d');

	// initialize Verify
	Verify.setScope($scope);

	//Retrieves the student's grade level and does time calculations
	$http.get(`${URL}gradeOfStudent?Id=${$scope.studentId}`)
	.then(function(response) {
		Dates.setZeroDate(response.data); // we only need the student's current grade to make this one calculation, so it is never stored anywhere.
	});

	//Retrieves all categories the selected student is working in
	$http.get(`${URL}categoriesByStudent?Id=${$scope.studentId}`)
	.then(function(response) {
		if (response.data.length == 0)
			$scope.categoriesOfStudent = ["No data found"];
		else
			$scope.categoriesOfStudent = response.data;
	});

	//Updates information for the selected category
	$scope.didUpdateCategory = function() {
		// Update repetition count for the form
		$scope.repOptions = ["1","2"];
		if ($scope.selectedCategory == "Calculation")
			$scope.repOptions.push("3","4","5");

		// Retrives all books in the selected category for use later in y-axis labeling
		$http.get(`${URL}booksInCategory?Category=${$scope.selectedCategory}`)
		.then(function(response) {
			allBooks = response.data;
		});

		// Fetch international data for the selected category for use later in line plotting
		$http.get(`${URL}internationalData?Category=${$scope.selectedCategory}`)
		.then(function(response) {
			iglRaw = response.data;
		});
	}


	//// CHART DEFAULTS ////
	Chart.defaults.global.defaultFontSize = 16;
	Chart.defaults.global.defaultFontColor = '#000';


	//// GIANT CHART GENERATION METHOD ////
	// "records" is intended to be a list of records drawn from an http call (response.data)
	let gen = function(records) {
		// try-catch block ensures that any major errors that may arise from the complex and probably buggy logic of the function gets properly written out in html
		try {
			var lowestDate   = Dates.monthsAgoToMonthIndex($scope.months), 	// x-axis bounds
				highestDate  = Dates.monthsAgoToMonthIndex($scope.until),
			    greatestBook = 0, 											// y-axis bounds
				leastBook    = allBooks.length - 1;
			
			var xAxisLabels = []; // main container of x axis labels, labels are objects containing properties "month", "year", and "grade" (also date, but that's irrelevant here)

			var data    = [], 		// data line: x is date, y is large sequence number, main graph plot
				bestFit = [], 		// best fit line: will contain two points outside the horizontal range of the graph
				igl     = [],		// igl line: an arbitrary goal line that denotes an international standard in some categories
				now     = [];		// now line: a vertical line that displays the current date for graphs that go past the current date

			//// DATA POINTS: Creates a point mapping each record to its respective spot on the x and y axis ////
			records.forEach(record => {
				data.push({
					x: Dates.dateToMonthIndex(Dates.stringToDateObject(record.startDate)),
					y: record.sequenceLarge,
				});

				greatestBook = Math.max(record.sequenceLarge, greatestBook); // adjust y-axis bounds
				leastBook = Math.min(record.sequenceLarge, leastBook);
			});

			//// Maps the internal linear scale of the x axis (lowestDate, ... highestDate) with labels containing dates and grades ////
			for(j = lowestDate; j < highestDate; j++) {
				var theLabel = Dates.dateAdd(Dates.zeroDate, j);
				theLabel.grade = Math.truncN(j / 12);

				xAxisLabels.push(theLabel);
			}


			//// BEST FIT LINE: least squares method ////
			if (data.length > 1) {
				var metrics = {
					init() {
						this.xmean = data.map(p => p.x).reduce((a, b) => a + b) / data.length; // average x
						this.ymean = data.map(p => p.y).reduce((a, b) => a + b) / data.length; // average y

						this.getDiff    = p => (p.x - this.xmean) * (p.y - this.ymean);   // numerator of formula, per term
						this.getSquares = p => (p.x - this.xmean) * (p.x - this.xmean);   // denominator of formula, per term

						this.diffSum    = data.map(p => this.getDiff(p)).reduce((a, b) => a + b);         // numerator of formula, summation
						this.squaresSum = data.map(p => this.getSquares(p)).reduce((a, b) => a + b);      // denominator of formula, summation

						this.slope = this.diffSum / this.squaresSum || 0;			// complete formula (with NaN check)

						this.getY = x => this.slope * (x - this.xmean) + this.ymean;	// point-slope form linear equation
						this.getPoint = x => {
							return {x: x, y: this.getY(x)};
						}

						delete this.init; // remove this function from the object, to avoid clutter
						return this;
					}
				}.init();

				// add two points beyond the edges of the graph
				bestFit.push(metrics.getPoint(lowestDate - 1), metrics.getPoint(highestDate + 1));

				// move greatestBook upward (if possible) if the best fit line goes above the data line
				greatestBook = Math.clamp(greatestBook, Math.trunc(metrics.getY(highestDate)), allBooks.length);
			}

			//// FINALIZE Y-AXIS BOUNDS ///
			var s = allBooks[leastBook-1];
			leastBook = s.sequenceLarge - s.sequence + 1; // set bottom bound to the start of the lowest sequence

			s = allBooks[greatestBook-1];
			greatestBook = s.sequenceLarge - s.sequence + 1 + s.sequenceLength; // set top bound to the start of the next sequence


			//// IGL LINE: an arbitrary goal line which is fixed for each category ////
			igl = iglRaw.map(data => {
				return {
					x: parseInt(data.grade.replace(/\D+/g,"")) * 12,  // extracts number from grade string and multiplies by 12 to create a month index
					y: data.sequenceLarge,
				}
			});
			

			//// NOW LINE: a vertical black line to indicate the current date ////
			var nowIndex = Dates.dateToMonthIndex(Dates.now);
			if (Math.clamp(nowIndex, lowestDate, highestDate) == nowIndex)
				now.push({
					x: nowIndex - 0.001,
					y: leastBook - 1,
				}, {
					x: nowIndex + 0.001,
					y: greatestBook + 1,
				});



			//// CALLBACKS ////
			let callbacks = {
				// callback for the x axis: displaying month numbers
				monthXAxis(label) {
					var s = xAxisLabels[label - lowestDate];
					if (s)
						return s.month + 1;
				},
				// callback for the x axis: displaying year numbers
				yearXAxis(label) {
					var s = xAxisLabels[label - lowestDate];
					if (s) {
						if(s.month == 6)
							return s.year;
						else if (s.month == 0)
							return "|";
					}
				},
				// callback for the x axis: displaying grade values
				gradeXAxis(label) {
					var s = xAxisLabels[label - lowestDate];
					if (s) {
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
					var s = allBooks[label-1];
					if (s && s.sequenceLength > 1) { // if the sequence length is 1, there's no good display for the y-axis, so just ignore that sequence
						if (s.sequence == 1)
							return "-----";
						else {
							var middle = Math.trunc(s.sequenceLength / 2) + 1;
							if (s.sequence == Math.max(middle, 2)) // max function ensures that the sequence number in the middle is at least 2 (and thus not 1, which would be the edge)
								return s.sequenceName

							return " "; // space is returned for everything else to spawn grid lines
						}
					}
				},
				// callback for the tooltip: displaying book titles
				titleTooltip(tooltipItem, data) {
					var s = allBooks[tooltipItem[0].yLabel-1];
					if (s) {
						if ($scope.selectedCategory == "Comprehension" || $scope.selectedCategory == "Calculation")
							return `${s.subcategory} - ${s.title}`;
						else
							return s.title;
					}
				},
				// callback for the tooltip: displaying exact dates
				descTooltip(tooltipItem, data) {
					var theDate = Dates.indexToDateObject(tooltipItem.xLabel);
					return `started on ${theDate.month + 1}/${theDate.date}/${theDate.year}`;
				},
			}

			//// CHART SPECIFICATIONS ////
			let chartSpecs = {
				datasets: [
						{
							label: $scope.studentName,
							data: data,
							backgroundColor: "rgba(255, 0, 0, 0.4)",
							borderColor: "rgba(255, 0, 0, 0.4)",
							fill: false,
							cubicInterpolationMode: 'monotone',
							hitRadius: 30,
						}, {
							label: "Best Fit Line",
							data: bestFit,
							backgroundColor: "rgba(0, 0, 255, 0.4)",
							borderColor: "rgba(0, 0, 255, 0.4)",
							fill: false,
							borderDash: [5],
							lineTension: 0,
							pointRadius: 0,
						}, {
							label: "IGL",
							data: igl,
							backgroundColor: "rgba(0, 255, 255, 0.4)",
							borderColor: "rgba(0, 255, 255, 0.4)",
							fill: false,
							cubicInterpolationMode: 'monotone',
							pointRadius: 0,
						}, {
							label: "Now",
							data: now,
							backgroundColor: "rgba(0, 0, 0, 0.2)",
							borderColor: "rgba(0, 0, 0, 0.2)",
							fill: false,
							lineTension: 0,
							pointRadius: 0,
						},
					].filter(d => d.data.length > 0),	// load datasets into the chart if they actually contain data
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
						},
					},
				],
			}


			//// BUILD CHART ////
			if (exampleChart)
				exampleChart.destroy();
			exampleChart = new Chart(myChart, {
				type: 'line',
				data: {
					datasets: chartSpecs.datasets,
				},
				options: {
					responsive: true,
					title: {
						display: false,
					},
					legend: {
						position: 'top',
					},
					tooltips: {
						enabled: true,
						callbacks: chartSpecs.tooltipCallbacks,
					},
					layout: {
						padding: {
							top: 10,
							bottom: 10,
						}
					},
					scales: {
						xAxes: chartSpecs.xAxes,
						yAxes: chartSpecs.yAxes,
					},
				},
			});

			$scope.logoDisplay = true;
			$scope.expanded = false;

			Verify.remove();
		}
		catch(err) {
			Verify.error(err);
		}
	}


	// Form submission: generates the line chart based on user specifications
	$scope.generateChart = function() {
		// Ensures form is valid before generation
		if (!Verify.check())
			return;

		// try-catch block ensures that any errors that arise outside of the gen() method (perhaps in java or something) get caught and properly written out in html
		try {
			if ($scope.months2 == 0 && Number.isInteger($scope.monthsF))
				$scope.until = -Math.max($scope.monthsF, 0)
			else
				$scope.until = $scope.months2;

			$http.get(`${URL}recordsForChart?StudentId=${$scope.studentId}&Category=${$scope.selectedCategory}&Months=${$scope.months}&Until=${$scope.until}&Reps=${$scope.selectedRep}`)
			.then(response => {
				var records = response.data.filter(r => r.startDate != null);
				if (Verify.errorIf(records.length == 0, "No data")) // no plottable data check
					return;
				gen(records);
			})
			.catch(Verify.error);
		}
		catch (err) {
			Verify.error(err);
		}
	};



});