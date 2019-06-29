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


	const ChartGen = function() {

		// The main container of x axis labels. Labels are objects containing properties "month", "year", and "grade" (also date, but that's irrelevant here)
		this.xAxisLabels = [];

		this.dataLookup = {};

		this.yAxisGridLineWidths = [];

		this.data		= [];
		this.bestFit	= [];
		this.igl		= [];
		this.now		= [];

		this.callbacks = {};
		this.chartSpecs = {};

		//// MAIN CHART GENERATION METHOD ////
		this.gen = (chartData) => {
			// Unpack chartData
			this.setDates(chartData.Dates);
			this.studentName 		= chartData.studentName;
			this.selectedCategory 	= chartData.selectedCategory;
			this.records 			= chartData.records;
			this.allBooks 			= chartData.allBooks;
			this.iglRaw 			= chartData.iglRaw;
			this.months 			= chartData.months;
			this.until 				= chartData.until;
			this.manualYAxisIncreases = chartData.manualYAxisIncreases;

			// Set X axis
			this.lowestDate    = Dates.monthsAgoToMonthIndex(this.months);
			this.highestDate   = Dates.monthsAgoToMonthIndex(this.until);
			this.monthInterval = this.highestDate - this.lowestDate > 13 ? 3 : 1;
			this.setXAxisLabels();

			// Set Y axis (initially)
			this.greatestBook = 0;
			this.leastBook    = this.allBooks.length;
			

			this.setDataLine(this.records);

			// Only make a best fit line if there are at least two data points
			this.bestFit = [];
			if (this.data.length > 1) {
				this.setBestFitLine(this.data);
			}

			// Only make an igl line if there is igl data to plot
			this.igl = [];
			if (this.iglRaw.length > 0) {
				this.setIGLLine(this.iglRaw);
			}
			
			// Only make a now line if it will be visible
			this.now = [];
			if (Math.clamp(this.nowIndex, this.lowestDate, this.highestDate) === this.nowIndex) { 
				this.setNowLine(this.nowIndex);
			}

			this.finalizeYAxis();
			
			for (let inc = 0; inc < Math.abs(this.manualYAxisIncreases); inc++) {
				this.moveYAxis(Math.sign(this.manualYAxisIncreases), true);
			}

			//// CALLBACKS ////
			this.callbacks.monthXAxis 	= this.monthXAxisCallback;
			this.callbacks.yearXAxis	= this.yearXAxisCallback;
			this.callbacks.gradeXAxis	= this.gradeXAxisCallback;
			this.callbacks.bookYAxis	= this.bookYAxisCallback;
			this.callbacks.titleTooltip = this.titleTooltipCallback;
			this.callbacks.descTooltip 	= this.descTooltipCallback;
			

			this.buildChart();
		};

		// Becuase of the way books in the database are indexed starting from 1, this helper method has a built-in -1 so that as a programmer we don't have to keep track of that all the time :)
		this.getBookAt = (bookIndex) => this.allBooks[bookIndex - 1];

		this.setDates = (dates) => {
			Dates.now = dates.now;
			Dates.zeroDate = dates.zeroDate;

			// Set Dates to a default value if viewing sample data
			if (!onPrint && !loggedIn) {
				Dates.now = {
					month: 2,
					year: 2019,
					date: 0
				};
			}

			this.nowIndex = Dates.dateToMonthIndex(Dates.now);
		}

		//// DATA POINTS: Creates a point mapping each record to its respective spot on the x and y axis ////
		this.setDataLine = (records) => {
			// Stores dictionary mappings from x axis numbers to arrays of full record objects which exist at that value
			this.dataLookup = {};

			this.data = records.map((record) => {
				// Adjust y axis bounds to include every book
				this.greatestBook = Math.max(record.sequenceLarge, this.greatestBook);
				this.leastBook = Math.min(record.sequenceLarge, this.leastBook);
				
				let x = Dates.dateToMonthIndex(Dates.stringToDateObject(record.startDate));
				
				// Put the record into the dataLookup dictionary
				if (this.dataLookup[x] === undefined) {
					this.dataLookup[x] = [];
				}
				this.dataLookup[x].push(record);
				
				return {
					x: x,
					y: record.sequenceLarge
				};
			});
		}

		//// BEST FIT LINE: implements the least squares method ////
		this.setBestFitLine = (data) => {
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
			this.bestFit = [metrics.getPoint(this.lowestDate - 1), metrics.getPoint(this.highestDate + 1)];

			// move greatestBook to see the best fit line
			this.setTopYBound(Math.trunc(metrics.getY(this.highestDate)));
		}

		//// IGL LINE: an arbitrary goal line which is fixed for each category ////
		this.setIGLLine = (iglRaw) => {
			// variables used for moving greatestBook upward
			let iglSegInd = -1;
			let midDate = (this.highestDate + this.lowestDate) / 2;
			
			let igl = this.igl = iglRaw.map((data) => { 
				let xVal = parseInt(data.grade.replace(/\D+/g, "")) * 12; // extracts number from grade string and multiplies by 12 to create a month index
				if (midDate > xVal) {
					iglSegInd++;
				}

				return {
					x: xVal,
					y: data.sequenceLarge
				}
			});

			// move greatestBook upward (if possible) to fit the IGL using point-slope formula
			iglSegInd = Math.clamp(iglSegInd, 0, igl.length - 2);
			let newGreatestBook = Math.trunc((igl[iglSegInd+1].y - igl[iglSegInd].y) / (igl[iglSegInd+1].x - igl[iglSegInd].x) * (midDate - igl[iglSegInd].x) + igl[iglSegInd].y);
			this.setTopYBound(newGreatestBook);
		}

		//// NOW LINE: a vertical black line to indicate the current date ////
		this.setNowLine = (nowIndex) => {
			this.now = [{
				x: nowIndex,
				y: 0
			}, {
				x: nowIndex,
				y: this.allBooks.length
			}];
		}

		//// X AXIS LABELS: Creates a label for each grid line along the x axis containing dates and grades ////
		this.setXAxisLabels = () => {
			this.xAxisLabels = [];

			for (let j = this.lowestDate; j < this.highestDate; j++) {
				let theLabel = Dates.dateAdd(Dates.zeroDate, j);
				theLabel.grade = Math.floor(j / 12);

				this.xAxisLabels.push(theLabel);
			}
		}

		this.setTopYBound = (value, override) => {
			if (override) {
				this.greatestBook = Math.clamp(this.leastBook + 1, value, this.allBooks.length);
			}
			else {
				this.greatestBook = Math.clamp(this.greatestBook, value, this.allBooks.length);
			}
		}

		// Used by the "increase Y" and "decrease Y" buttons to set chart height manually
		this.moveYAxis = (amount, doNotBuild) => {
			if (amount > 0) {
				// Should do nothing if y axis is on the highest possible sequence
				if (this.greatestBook == this.allBooks.length) {
					return;
				}

				this.greatestBook++; // this value will get finalized upward later
			}
			else {
				// Should do nothing if y axis only shows one sequence
				if (this.getBookAt(this.greatestBook - 1).sequenceName === this.getBookAt(this.leastBook).sequenceName) {
					return;
				}

				this.greatestBook -= this.getBookAt(this.greatestBook - 1).sequenceLength + 1; // since the top of the graph is currently on book 1 of a non-visible sequence, we need an extra -1 and +1 here to reach the desired sequence
			}

			this.finalizeYAxis();

			if (!doNotBuild) {
				this.buildChart();
			}
		}

		//// FINALIZE Y-AXIS BOUNDS: Stretch out the bounds to include all grid lines within a sequence ////
		// The goal is to make the bottom and top books have an inner sequence value of 1
		this.finalizeYAxis = () => {
			let seq = this.getBookAt(this.leastBook);
			this.leastBook = seq.sequenceLarge - seq.sequence + 1; // set bottom bound to the start of the lowest sequence

			seq = this.getBookAt(this.greatestBook);
			this.setTopYBound(seq.sequenceLarge - seq.sequence + 1 + seq.sequenceLength, true); // set top bound to the start of the next sequence, without going over
		
			// Go through each value on the y axis and store in an array whether or not that grid line should be bold
			this.yAxisGridLineWidths = [];
			for (seq = this.greatestBook; seq >= this.leastBook; seq--) {
				this.yAxisGridLineWidths.push(this.getBookAt(seq).sequence === 1 ? 1 : 0);
			}
		}

		this.setChartSpecs = () => {
			// global specs
			Chart.defaults.global.defaultFontSize = 16;
			Chart.defaults.global.defaultFontColor = '#000';
			Chart.defaults.global.elements.line.borderWidth = 5;

			this.chartSpecs = {
				datasets: [
						{
							label: "Progress",
							data: this.data,
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
							data: this.igl,
							backgroundColor: "rgba(46, 204, 113, 0.75)",
							borderColor: "rgba(46, 204, 113, 0.75)",
							fill: false,
							cubicInterpolationMode: 'monotone',
							pointRadius: 0
						}, {
							label: "Today",
							data: this.now,
							backgroundColor: "rgba(0, 0, 0, 0.2)",
							borderColor: "rgba(0, 0, 0, 0.2)",
							fill: false,
							lineTension: 0,
							pointRadius: 0
						}
					].filter((dataset) => dataset.data.length > 0),	// Only load datasets into the chart if they actually contain data
				tooltipCallbacks: {
					title: this.callbacks.titleTooltip,
					label: this.callbacks.descTooltip
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
							min: this.lowestDate,
							max: this.highestDate,
							maxRotation: 0,
							callback: this.callbacks.monthXAxis
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
							min: this.lowestDate,
							max: this.highestDate,
							maxRotation: 0,
							padding: 0,
							callback: this.callbacks.yearXAxis
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
							min: this.lowestDate,
							max: this.highestDate,
							maxRotation: 0,
							callback: this.callbacks.gradeXAxis
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
							color: this.yAxisGridLineWidths.map((o) => `rgba(0, 0, 0, ${o ? 0.5 : 0.1})`)
						},
						scaleLabel: {
							display: false
						},
						ticks: {
							stepSize: 1,
							autoSkipPadding: 50,
							min: this.leastBook,
							max: this.greatestBook,
							lineHeight: 1,
							callback: this.callbacks.bookYAxis
						}
					}
				]
			};
		}

		this.buildChart = () => {
			this.setChartSpecs();

			if (exampleChart != null) {
				exampleChart.destroy();
			}

			exampleChart = new Chart(myChart, {
				type: 'line',
				data: {
					datasets: this.chartSpecs.datasets
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
						callbacks: this.chartSpecs.tooltipCallbacks
					},
					layout: {
						padding: {
							top: 10,
							bottom: 10
						}
					},
					scales: {
						xAxes: this.chartSpecs.xAxes,
						yAxes: this.chartSpecs.yAxes
					}
				}
			});
		}

		// Callback for the x axis: displaying month numbers
		this.monthXAxisCallback = (label) => {
			let s = this.xAxisLabels[label - this.lowestDate];
			if (s) {
				// Under each month in the interval, write the month number
				if (s.month % this.monthInterval === 0) {
					return s.month + 1;
				}
			}
		},

		// Callback for the x axis: displaying year numbers
		this.yearXAxisCallback = (label) => {
			let s = this.xAxisLabels[label - this.lowestDate];
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

		// Callback for the x axis: displaying grade values
		this.gradeXAxisCallback = (label) => {
			let s = this.xAxisLabels[label - this.lowestDate];
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

		// Callback for the y axis: displaying book sequences
		this.bookYAxisCallback = (label) => {
			let s = this.getBookAt(label);
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

		// Callback for the tooltip: displaying book titles
		this.titleTooltipCallback = (tooltipItem, data) => {
			let s = this.getBookAt(tooltipItem[0].yLabel);
			if (s) {
				// The title should include the subcategory depending on the category
				if (["Math", "Reading"].includes(this.selectedCategory)) {
					return `${s.subcategory} - ${s.title}`;
				}
				else {
					return s.title;
				}
			}
		},

		// callback for the tooltip: displaying exact dates
		this.descTooltipCallback = (tooltipItem, data) => {
			let theDate = Dates.indexToDateObject(tooltipItem.xLabel);
			let theRecord = this.dataLookup[tooltipItem.xLabel].filter((record) => record.sequenceLarge === tooltipItem.yLabel)[0];
			
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

	}


	


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

		let chartGen = new ChartGen();
		let chartData = {};

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
				chartData = {
					studentName: 			$scope.studentName,
					selectedCategory: 		$scope.selectedCategory,
					records: 				response.data,
					allBooks: 				allBooks,
					iglRaw: 				iglRaw,
					months: 				$scope.months, 
					until: 					$scope.until,
					manualYAxisIncreases:  	0,
					Dates: 					Dates
				}
				$window.localStorage.setItem(2, JSON.stringify(chartData));

				try {
					chartGen.gen(chartData);
					Verify.remove();
				}
				catch (e) {
					Verify.error(e);
				}
			})
			.catch(Verify.error);
			
		};

		$scope.moveYAxis = (amount) => {
			chartGen.moveYAxis(amount);

			chartData.manualYAxisIncreases += amount;
			$window.localStorage.setItem(2, JSON.stringify(chartData));
		};

		$scope.printChart = () => {
			window.location.href = "LineChartPrint.html";
		};
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

			(new ChartGen()).gen(chartData);

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