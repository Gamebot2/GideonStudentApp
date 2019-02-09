/*
 * GIDEON APP
 * This angular module is the basis for all sitewide controllers. Also contains the controller for Header.html.
 * 
 * NOTES:
 * - Set URL to URLs.local or URLs.online depending on which server the application should point to
 */


const URL = "http://localhost:8080/";

<<<<<<< HEAD
gideonApp = angular.module('gideonApp', ['ngMaterial', 'ngMessages']).config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('black', $mdThemingProvider.extendPalette('grey', {
        '500': '#000000',
    }));
    $mdThemingProvider.theme('default')
        .primaryPalette('black')
        .accentPalette('amber')
        .warnPalette('red');
});
=======
const URLs = {
    online: "http://gideon-records.us-east-1.elasticbeanstalk.com/",
    local: "http://localhost:5000/"
};
const URL = URLs.local;


let currentUsername = "";
let loggedIn = false;

gideonApp.controller('header', ($scope, $http) => {
    
    $http.get(`${URL}getUser`).then((response) => {
        currentUsername = response.data[0];
        loggedIn = (response.data != "");
        
        $scope.currentUsername = currentUsername;
        $scope.loggedIn = loggedIn;
    });

    $scope.login = () => {
        window.location.href = "index.html";
    };

    $scope.logout = () => {
		$http.get(`${URL}logout`)
		.then(_ => {
			window.location.href = "index.html";
		});
    };

    $scope.goTo = (href) => {
        window.location.href = href;
    };
});
>>>>>>> master
