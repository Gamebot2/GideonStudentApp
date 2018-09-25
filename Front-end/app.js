/*
 * GIDEON APP
 * This angular module is the basis for all sitewide controllers.
 * 
 * NOTES:
 * - "gideonApp" and "HTTP_LINK" are universal references used in every Ctrl.js script
 */


var gideonApp = angular.module('gideonApp', ['ngAnimate']);

const URL = "http://localhost:8081/";





//// TESTING SPACE ////


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