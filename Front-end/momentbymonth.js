/*
 * MOMENT BY MONTH
 * A super simple utility file containing methods meant to manipulate objects with month, year, and date properties.
 * Other variables exist specifically to faciliate the x-axis on the graph
 *
 * NOTES:
 * - The value on the x-axis that is "zero" is the month in which a student starts Kindergarten. Everything else is based around that number.
 * - Each month corresponds to a value of 1 on the x-axis. Days are decimals in between, whose translations to integer values depends on the number of days in the month.
 * - Months are numbered 0 through x instead of 1 through x for easy calculations. When displaying, you should use month + 1.
 * - Because the exact month value is not always needed in a calculation, sometimes the "date" property is ignored and simply set to be 0. This is for simplicity
 */

var Dates = {
	// a better modulo function that loops around for negative numbers
	mod: (x, n) => (x % n + n) % n,

	// a better truncation function that loops around for negative numbers
	modtrunc: (x) => Math.trunc(x) - (x < 0 ? 1 : 0),

	// function that figures out when this "month in which a student starts Kindergarten" is
	setZeroDate(currentGrade) {
		this.zeroDate = {
			month: 7,
			year: this.now.year - currentGrade - (this.now.month < 7 ? 1 : 0), // subtract an extra 1 from the year if it is currently before august
			date: 0
		}
	},

	// function that returns a month/year/floating-point-date object a certain number of months after another one of those objects
	dateAdd(originalDate, addition) {
		var numeral = originalDate.year * 12 + originalDate.month;
		numeral += addition;
		return {
			month: this.mod(numeral, 12),
			year: this.modtrunc(numeral / 12),
			date: 0
		}
	},

	// function that returns a month/year/floating-point-date object a certain number of months prior to another one of those objects
	dateSubtract(originalDate, subtraction) {
		return this.dateAdd(originalDate, -1 * subtraction);
	},

	// function that returns the month difference between two month/year/floating-point-date objects
	dateCompare(date1, date2) {
		return (date1.year - date2.year) * 12 + (date1.month - date2.month) + (date1.date - date2.date);
	},

	// function that returns a month/year/floating-point-date object from a normal date object
	toDateObject(startDate) {
		var d = moment(startDate.split(" ")[0]);
		return {
			month: d.month(),
			year: d.year(),
			date: (d.date() - 1) / d.daysInMonth()
		}
	},

	// function that returns a month/year/floating-point-date object from a specific index, relative to zeroDate
	getDateObject(index) {
		var theDate = this.dateAdd(this.zeroDate, this.modtrunc(index));

		var daysInMonth = moment(`${theDate.year} ${theDate.month + 1}`, "YYYY MM").daysInMonth();
		theDate.date = Math.round(this.mod(index, 1) * daysInMonth) + 1;

		return theDate;
	},

	// function that converts an input month (represents # of months in the past) to a date object
	inputToDate(months) {
		return this.dateCompare(this.dateSubtract(this.now, months), this.zeroDate);
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

