/*
 * CHART CONTROLLER
 * Contains the functions and variables used in LineChart.html
 *
 * NOTES:
 * - The variable "gideonApp" is defined in gideonApp.js. That file must be included prior to this one in html.
 * - The variable "Dates" is defined in momentbymonth.js. That file must be included prior to this one in html.
 * - The variable "Verify" is defined in verify.js. That file must be included prior to this one in html.
 * - The application expects there to be a JSON string representing a student in slot 0 of the window storage. Make sure these exist before opening LineChart.html.
 * - Slot 1 of window storage can be used to preload a category. Make sure that if this value exists, it is valid.
 */


// Custom extension to the Math class: clamp returns the median of three numbers, modN is the same as % but with looping around for negative numbers
Math.clamp = (num, min, max) => Math.min(Math.max(num, min), max);
Math.modN = (x, n) => (x % n + n) % n;


gideonApp.controller('chartCtrl', ($scope, $http, $window) => {

	let onPrint = $window.location.href.includes("Print");

	// Stores the eventual Chart object
	let exampleChart;
	// Stores the canvas context on which the chart is drawn
	let myChart = document.getElementById('lineChart').getContext('2d');


	///////////////////////////////////////
	//// GIANT CHART GENERATION METHOD ////
	///////////////////////////////////////
	// chartData is an object containing:
	// - studentName: the name of the student who the graph represents
	// - selectedCategory: the subject of the records shown
	// - records: an array of record objects
	// - allBooks: an array of book objects in a given category
	// - iglRaw: an array of IGL data grabbed directly from the database
	// - months: the number of months in the past which should be at the left of the x axis
	// - until: the number of months in the past which should be at the right of the x axis (can be negative)
	// - Dates: an instance of the object defined in momentbymonth.js
	// The reason an object is used is so that it can all be loaded onto a single local storage space in the window
	let gen = (chartData) => {
		// Unpack chartData
		let studentName = chartData.studentName;
		let selectedCategory = chartData.selectedCategory;
		let records = chartData.records;
		let allBooks = chartData.allBooks;
		let iglRaw = chartData.iglRaw;
		let months = chartData.months;
		let until = chartData.until;
		Dates.now = chartData.Dates.now;
		Dates.zeroDate = chartData.Dates.zeroDate;

		// Set Dates to a default value if viewing sample data
		if (!onPrint && !loggedIn) {
			Dates.now = {
				month: 2,
				year: 2019,
				date: 0
			};
		}

		// Set x axis bounds
		let lowestDate   = Dates.monthsAgoToMonthIndex(months);
		let highestDate  = Dates.monthsAgoToMonthIndex(until);
		// Set y axis bounds
		let greatestBook = 0;
		let leastBook    = allBooks.length - 1;
		
		// Decide whether to set the scale of the x axis to one month or three months
		let monthInterval = highestDate - lowestDate > 13 ? 3 : 1;

		// The main container of x axis labels. Labels are objects containing properties "month", "year", and "grade" (also date, but that's irrelevant here)
		let xAxisLabels = [];

		// Points on the data line: x is date, y is large sequence number
		let data    = [];
		// Points on the best fit line: contains two opints outside the horizontal range of the graph (currently not displayed, but used to adjust the y-axis bounds for optimal display)
		let bestFit = [];
		// Points on the IGL line: an arbitrary goal line that denotes an international standard in some categories
		let igl     = [];
		// Points on the now line: a vertical line that displays the current date for graphs that go past the current date
		let now     = [];

		// Stores dictionary mappings from x axis numbers to arrays of full record objects which exist at that value
		let dataLookup = {};

		//// DATA POINTS: Creates a point mapping each record to its respective spot on the x and y axis ////
		data = records.map((record) => {
			// Adjust y axis bounds to include every book
			greatestBook = Math.max(record.sequenceLarge, greatestBook);
			leastBook = Math.min(record.sequenceLarge, leastBook);
			
			let x = Dates.dateToMonthIndex(Dates.stringToDateObject(record.startDate));
			
			// Put the record into the dataLookup dictionary
			if (dataLookup[x] === undefined) {
				dataLookup[x] = [];
			}
			dataLookup[x].push(record);
			
			return {
				x: x,
				y: record.sequenceLarge
			};
		});

		//// X AXIS LABELS: Creates a label for each grid line along the x axis containing dates and grades ////
		for (let j = lowestDate; j < highestDate; j++) {
			let theLabel = Dates.dateAdd(Dates.zeroDate, j);
			theLabel.grade = Math.floor(j / 12);

			xAxisLabels.push(theLabel);
		}


		//// BEST FIT LINE: implements the least squares method ////
		// Note that a best fit line should not be made if there are not at least 2 points on the graph because the line would be worthless
		if (data.length > 1) {
			let metrics = {
				init() {
					this.xmean = data.reduce((a, p) => a + p.x, 0) / data.length; // average x
					this.ymean = data.reduce((a, p) => a + p.y, 0) / data.length; // average y

					this.getDiff    = (p) => (p.x - this.xmean) * (p.y - this.ymean);   // numerator of formula, per term
					this.getSquares = (p) => (p.x - this.xmean) * (p.x - this.xmean);   // denominator of formula, per term

					this.diffSum    = data.reduce((a, p) => a + this.getDiff(p), 0);         // numerator of formula, summation
					this.squaresSum = data.reduce((a, p) => a + this.getSquares(p), 0);      // denominator of formula, summation

					this.slope = this.diffSum / this.squaresSum || 0;			// complete formula (with NaN check)

					this.getY = (x) => this.slope * (x - this.xmean) + this.ymean;	// point-slope form linear equation
					this.getPoint = (x) => ({x: x, y: this.getY(x)});

					delete this.init; // remove this function from the object, to avoid clutter
					return this;
				}
			}.init();

			// add two points beyond the edges of the graph
			bestFit = [metrics.getPoint(lowestDate - 1), metrics.getPoint(highestDate + 1)];

			// move greatestBook upward (if possible) if the best fit line goes above the data line
			greatestBook = Math.clamp(greatestBook, Math.trunc(metrics.getY(highestDate)), allBooks.length);
		}

		//// IGL LINE: an arbitrary goal line which is fixed for each category ////
		let iglSegInd = -1;
		let midDate = (highestDate + lowestDate) / 2;
		igl = iglRaw.map((data) => { 
			let xVal = parseInt(data.grade.replace(/\D+/g, "")) * 12; // extracts number from grade string and multiplies by 12 to create a month index
			if (midDate > xVal) {
				iglSegInd++;
			}

			return {
				x: xVal,
				y: data.sequenceLarge
			}
		});

		// move greatestBook upward (if possible) to fit the IGL
		iglSegInd = Math.max(iglSegInd, 0);
		let newGreatestBook = Math.trunc((igl[iglSegInd+1].y - igl[iglSegInd].y) / (igl[iglSegInd+1].x - igl[iglSegInd].x) * (midDate - igl[iglSegInd].x) + igl[iglSegInd].y);
		greatestBook = Math.clamp(greatestBook, newGreatestBook, allBooks.length);

		//// FINALIZE Y-AXIS BOUNDS: Stretch out the bounds to include all grid lines within a sequence ////
		// The goal is to make the bottom and top books have an inner sequence value of 1
		let seq = allBooks[leastBook-1];
		leastBook = seq.sequenceLarge - seq.sequence + 1; // set bottom bound to the start of the lowest sequence

		seq = allBooks[greatestBook-1];
		greatestBook = Math.min(allBooks.length, seq.sequenceLarge - seq.sequence + 1 + seq.sequenceLength); // set top bound to the start of the next sequence, without going over

		// Go through each value on the y axis and store in an array whether or not that grid line should be bold
		let yAxisGridLineIsMajor = [];
		for (seq = greatestBook; seq >= leastBook; seq--) {
			yAxisGridLineIsMajor.push(allBooks[seq-1].sequence === 1 ? 1 : 0);
		}
		

		//// NOW LINE: a vertical black line to indicate the current date ////
		let nowIndex = Dates.dateToMonthIndex(Dates.now);
		if (Math.clamp(nowIndex, lowestDate, highestDate) === nowIndex) { // Note that the now line doesn't need to be generated if it won't be visible
			now = [{
				x: nowIndex,
				y: leastBook - 1
			}, {
				x: nowIndex,
				y: greatestBook + 1
			}];
		}


		//// CALLBACKS ////
		let callbacks = {
			// Callback for the x axis: displaying month numbers
			monthXAxis(label) {
				let s = xAxisLabels[label - lowestDate];
				if (s) {
					// Under each month in the interval, write the month number
					if (s.month % monthInterval === 0) {
						return s.month + 1;
					}
				}
			},

			// Callback for the x axis: displaying year numbers
			yearXAxis(label) {
				let s = xAxisLabels[label - lowestDate];
				if (s) {
					if(s.month === 6) {
						// In the middle of the calendar year, write the year number
						return s.year;
					}
					else if (s.month === 0) {
						// At the beginning of a calender year, draw a divider
						return "|";
					}
				}
			},

			// callback for the x axis: displaying grade values
			gradeXAxis(label) {
				let s = xAxisLabels[label - lowestDate];
				if (s) {
					if(s.month === 1) {
						// In the middle of the school year, write the grade string from a dictionary
						return ({
							'-1': "Pre-K", 
							'0': "Kindergarten", 
							'1': "1st Grade", 
							'2': "2nd Grade", 
							'3': "3rd Grade", 
							'4': `${s.grade}th Grade`
						})[Math.clamp(-1, s.grade, 4)];
					}
					else if (s.month === 7) {
						// At the beginning of a school year, draw a divider
						return "|";
					}
				}
			},

			// callback for the y axis: displaying book sequences
			bookYAxis(label) {
				let s = allBooks[label-1];
				if (s) {
					if (s.sequence === 1) {
						// At the beginning of a sequence, draw a divider
						return "-----";
					}
					else if (s.sequence === Math.trunc(s.sequenceLength / 2) + 1) {
						// In the middle of a sequence, write the name
						return s.sequenceName.toUpperCase();
					}
					else {
						// Otherwise, write an empty space to spawn in grid lines
						return " ";
					}
				}
			},

			// callback for the tooltip: displaying book titles
			titleTooltip(tooltipItem, data) {
				let s = allBooks[tooltipItem[0].yLabel-1];
				if (s) {
					// The title should include the subcategory depending on the category
					if (["Math", "Reading"].includes(selectedCategory)) {
						return `${s.subcategory} - ${s.title}`;
					}
					else {
						return s.title;
					}
				}
			},

			// callback for the tooltip: displaying exact dates
			descTooltip(tooltipItem, data) {
				let theDate = Dates.indexToDateObject(tooltipItem.xLabel);
				let theRecord = dataLookup[tooltipItem.xLabel].filter((record) => record.sequenceLarge === tooltipItem.yLabel)[0];
				
				let description = [
					`Started on ${theDate.month + 1}/${theDate.date}/${theDate.year}`,
					`Rep ${theRecord.rep}`,
					`Notes:`
				];
				
				// Loads the notes from the record object
				(theRecord.notes || "None").split(' ').forEach((str) => {
					// Add line breaks to the record notes every 100 characters
					let desiredString = description[description.length-1] + " " + str;
					if (desiredString.length < 100) {
						description[description.length-1] = desiredString;
					}
					else {
						description.push(str);
					}
				});

				return description;
			}
		};


		//// GLOBAL SPECS ////
		Chart.defaults.global.defaultFontSize = 16;
		Chart.defaults.global.defaultFontColor = '#000';
		Chart.defaults.global.elements.line.borderWidth = 5;


		//// CHART SPECIFICATIONS ////
		let chartSpecs = {
			datasets: [
					{
						label: "Progress",
						data: data,
						backgroundColor: "rgba(231, 76, 60, 0.75)",
						borderColor: "rgba(231, 76, 60, 0.75)",
						fill: false,
						cubicInterpolationMode: 'monotone',
						hitRadius: 5,
						pointRadius: 3,
						pointHoverRadius: 4,
						pointBorderWidth: 0
					}, {
						label: "IGL",
						data: igl,
						backgroundColor: "rgba(46, 204, 113, 0.75)",
						borderColor: "rgba(46, 204, 113, 0.75)",
						fill: false,
						cubicInterpolationMode: 'monotone',
						pointRadius: 0
					}, {
						label: "Today",
						data: now,
						backgroundColor: "rgba(0, 0, 0, 0.2)",
						borderColor: "rgba(0, 0, 0, 0.2)",
						fill: false,
						lineTension: 0,
						pointRadius: 0
					}
				].filter((dataset) => dataset.data.length > 0),	// Only load datasets into the chart if they actually contain data
			tooltipCallbacks: {
				title: callbacks.titleTooltip,
				label: callbacks.descTooltip
			},
			xAxes: [
				{
					id:"xAxis1",
					type: 'linear',
					gridLines: {
						display: true,
						lineWidth: 2,
						color: "rgba(0, 0, 0, 0.5)"
					},
					scaleLabel: {
						display: false,
						padding: -5
					},
					ticks: {
						dislay: false,
						stepSize: 1,
						autoSkip: false,
						min: lowestDate,
						max: highestDate,
						maxRotation: 0,
						callback: callbacks.monthXAxis
					}
				}, {
					id: "xAxis2",
					type: 'linear',
					gridLines: {
						display: false,
						drawBorder: true,
						color: "rgba(0, 0, 0, 0.5)"
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
						callback: callbacks.yearXAxis
					}
				}, {
					id: "xAxis3",
					type: 'linear',
					gridLines: {
						display: false,
						drawBorder: true,
						drawOnChartArea: false,
						color: "rgba(0, 0, 0, 0.5)"
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
						callback: callbacks.gradeXAxis
					}
				}
			],
			yAxes: [
				{
					id: "yAxis1",
					type: 'linear',
					position: 'left',
					display: true,
					gridLines: {
						lineWidth: 2,
						color: yAxisGridLineIsMajor.map((o) => `rgba(0, 0, 0, ${o ? 0.5 : 0.1})`)
					},
					scaleLabel: {
						display: false
					},
					ticks: {
						stepSize: 1,
						autoSkipPadding: 50,
						min: leastBook,
						max: greatestBook,
						lineHeight: 1,
						callback: callbacks.bookYAxis
					}
				}
			]
		};


		//// BUILD CHART ////
		if (exampleChart != null) {
			exampleChart.destroy();
		}
		exampleChart = new Chart(myChart, {
			type: 'line',
			data: {
				datasets: chartSpecs.datasets
			},
			options: {
				responsive: true,
				title: {
					display: true,
					fontSize: 24,
					text: " "	// The title is an empty space in order to give the chart more space above it
				},
				legend: {
					position: 'top'
				},
				tooltips: {
					enabled: !onPrint,
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
	};


	////////////////////////
	//// LINECHART.HTML ////
	////////////////////////
	let loadChartPage = () => {
		// Fetch the student from the local storage
		let stud = JSON.parse($window.localStorage.getItem(0));
		$scope.studentId = stud.studentId;
		$scope.studentName = stud.client;

		// Initialize variables
		let allBooks = [];
		$scope.expanded = true;
		$scope.repOptions = ["Select a category first"];
		$scope.months = 12;
		$scope.months2 = 0;

		// Initialize Verify
		Verify.setScope($scope);

		// Retrieves the student's grade level and does time calculations
		$http.get(`${URL}gradeOfStudent?Id=${$scope.studentId}`)
		.then((response) => {
			Dates.setZeroDate(response.data);
		});

		// Updates information for the selected category
		$scope.didUpdateCategory = () => {
			// Update repetition count for the form
			$scope.repOptions = ["All", "1", "2"];
			if (["Math","Reading"].includes($scope.selectedCategory)) {
				$scope.repOptions.push("3", "4", "5");
			}

			// Retrives all books in the selected category for use later in y-axis labeling
			$http.get(`${URL}booksInCategory?Category=${$scope.selectedCategory}`)
			.then((response) => {
				allBooks = response.data;
			});

			// Fetch international data for the selected category for use later in line plotting
			$http.get(`${URL}internationalData?Category=${$scope.selectedCategory}`)
			.then((response) => {
				iglRaw = response.data;
			});
		};

		// Retrieves all categories the selected student is working in
		$http.get(`${URL}categoriesByStudent?Id=${$scope.studentId}`)
		.then((response) => {
			if (response.data.length === 0) {
				// If there are no categories, show that there is no data
				$scope.categoriesOfStudent = ["No data found"];
			}
			else {
				$scope.categoriesOfStudent = response.data;

				// Checks for a pre-loaded category name in slot 1 of window storage
				let cat = $window.localStorage.getItem(1);
				if (cat && $scope.categoriesOfStudent.includes(cat)) {
					$scope.selectedCategory = cat;
					$window.localStorage.setItem(1, "");
					$scope.didUpdateCategory();
				}
			}
		});

		// Form submission: generates the line chart based on user specifications
		$scope.generateChart = () => {
			// Ensures form is valid before generation
			if (!Verify.check()) {
				return;
			}

			// Sets the until date based on whether the user has specified a certain future projection amount
			$scope.until = $scope.months2;
			if ($scope.months2 === 0 && Number.isInteger($scope.monthsF)) {
				$scope.until = -Math.max($scope.monthsF, 0);
			}

			// Subtract 1 in order to display the entire most recent month
			// (eg: if it is currently December 15th, the graph will run until December 31st)
			$scope.until -= 1;

			$http.get(`${URL}recordsForChart?StudentId=${$scope.studentId}&Category=${$scope.selectedCategory}&Months=${$scope.months}&Until=${$scope.until}&Reps=${$scope.selectedRep}`)
			.then((response) => {
				// Error if there is no plottable data
				if (Verify.errorIf(response.data.length === 0, "No data")) {
					return;
				}

				// Create the chartData object
				let o = {
					studentName: $scope.studentName,
					selectedCategory: $scope.selectedCategory,
					records: response.data,
					allBooks: allBooks,
					iglRaw: iglRaw,
					months: $scope.months, 
					until: $scope.until, 
					Dates: Dates
				}
				$window.localStorage.setItem(2, JSON.stringify(o));

				try {
					gen(o);
					Verify.remove();
				}
				catch (e) {
					Verify.error(e);
				}
			})
			.catch(Verify.error);
			
		};

		$scope.printChart = () => {
			window.location.href = "LineChartPrint.html";
		}
	}


	//////////////////////////////////
	//// LINECHARTPRINT.HTML CODE ////
	//////////////////////////////////
	let loadPrintPage = () => {
		try {
			// Get the chartData object from the window storage
			let chartData = JSON.parse($window.localStorage.getItem(2));
			$scope.studentName = chartData.studentName;
			$scope.selectedCategory = chartData.selectedCategory;

			gen(chartData);

			// Automatically print the page after the chart's animation
			setTimeout(window.print, 1000);
		}
		catch (e) {
			console.error(e);
		}
	}


	// Run the right method depending on the current page
	if (onPrint) {
		loadPrintPage();
	}
	else {
		loadChartPage();	
	}
	window.scrollTo(0, 0);
});