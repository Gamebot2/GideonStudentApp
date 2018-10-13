/*
 * MOMENT BY MONTH
 * A super simple utility file containing methods meant to manipulate objects with month, year, and date properties.
 * Other variables exist specifically to faciliate the x-axis on the graph
 *
 * NOTES:
 * - The date objects that are manipulated by the methods are formatted: {month: m, year: y, date: d}. m is an integer from 0-11, y is an integer from 0-xxxx, and d is a decimal from 0-1
 * - A "month index" is a single number that encapsulates the entire object. 0 is the object corresponding to August of Kindergarten. Each additional month from there is +1.
 * - Months are numbered 0 through 11 instead of 1 through 12 for easy calculations. When displaying, you should use month + 1.
 * - Because the exact month value is not always needed in a calculation, sometimes the "date" property is ignored and simply set to be 0. This is for simplicity
 */


// Custom extension to the Math class: modN and truncN are the same as mod and trunc but loop around for negative numbers
Math.modN = (x, n) => (x % n + n) % n;
Math.truncN = (x) => Number.isInteger(x) ? x : Math.trunc(x) - (x < 0 ? 1 : 0);


var Dates = {

	// function that figures out when this "Augest of Kindergarten" month is
	setZeroDate(currentGrade) {
		this.zeroDate = {
			month: 7,
			year: this.now.year - currentGrade - (this.now.month < 7 ? 1 : 0), // subtract an extra 1 from the year if it is currently before august
			date: 0
		}
	},

	// function that returns a date object a certain number of months after another one of those objects (note: object loses floating point day)
	dateAdd(originalDate, addition) {
		var numeral = (originalDate.year * 12 + originalDate.month) + addition;
		return {
			month: Math.modN(numeral, 12),
			year: Math.truncN(numeral / 12),
			date: 0
		}
	},

	// function that returns a date object a certain number of months prior to another one of those objects (note: object loses floating point day)
	dateSubtract(originalDate, subtraction) {
		return this.dateAdd(originalDate, -subtraction);
	},

	// function that returns the month difference between two date objects
	dateCompare(date1, date2) {
		return (date1.year - date2.year) * 12 + (date1.month - date2.month) + (date1.date - date2.date);
	},



	// Converts a Date string or DateTime string into a date object
	stringToDateObject(startDate) {
		var d = moment(startDate.split(" ")[0]);
		return {
			month: d.month(),
			year: d.year(),
			date: (d.date() - 1) / d.daysInMonth()
		}
	},

	// Converts a month index into a date object
	indexToDateObject(index) {
		var theDate = this.dateAdd(this.zeroDate, Math.truncN(index));

		var daysInMonth = moment(`${theDate.year} ${theDate.month + 1}`, "YYYY MM").daysInMonth();
		theDate.date = Math.round(Math.modN(index, 1) * daysInMonth) + 1;

		return theDate;
	},

	// Converts a date object into a month index
	dateToMonthIndex(date) {
		return this.dateCompare(date, this.zeroDate);
	},

	// Converts an input index (based on months in the past) to a month index
	monthsAgoToMonthIndex(months) {
		return this.dateToMonthIndex(this.dateSubtract(this.now, months));
	},


	// INIT FUNCTION: creates non-function attributes
	init() {
		var n = moment();
		this.now = {
			month: n.month(),
			year: n.year(),
			date: (n.date() - 1) / n.daysInMonth()
		};
		this.zeroDate = this.setZeroDate(0);

		delete this.init; // remove this function from the object, to avoid clutter
		return this;
	},

}.init();

