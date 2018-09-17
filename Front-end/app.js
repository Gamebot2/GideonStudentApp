/*
 * GIDEON APP
 * This angular module is the basis for all sitewide controllers.
 * 
 * NOTES:
 * - Below the declaration of "app" is a space for testing quick html files on the side
 */


var gideonApp = angular.module('gideonApp', ['ngAnimate']);






// MULTITEST.HTML
var newApp = angular.module('testApp', ['ngAnimate']);

gideonApp.controller('testCtrl', function($scope) {
	
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