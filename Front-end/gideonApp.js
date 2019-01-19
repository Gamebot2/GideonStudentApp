/*
 * GIDEON APP
 * This angular module is the basis for all sitewide controllers.
 * 
 * NOTES:
 * - "gideonApp" and "URL" are universal references used in every Ctrl.js script
 */


gideonApp = angular.module('gideonApp', ['ngMaterial']);

const URL = "http://localhost:5000/";


var loggedIn = false;

gideonApp.controller('header', ($scope, $http) => {
    $scope.loggedIn = false;
    $http.get(`${URL}getLoggedIn`).then(response => {
        loggedIn = $scope.loggedIn = response.data;
    });

    $scope.login = () => {
        window.location.href = "Home.html";
    }

    $scope.logout = () => {
		$http.get(`${URL}logout`)
		.then(_ => {
			window.location.href = "Home.html";
		});
	}
})