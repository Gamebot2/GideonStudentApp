/*
 * GIDEON APP
 * This angular module is the basis for all sitewide controllers. Also contains the controller for Header.html.
 * 
 * NOTES:
 * - Set URL to URLs.local or URLs.online depending on which server the application should point to
 */


// Contains links to online and local instances of the application
const URLs = {
    online: "http://gideon-records.us-east-1.elasticbeanstalk.com/",
    local: "http://localhost:5000/"
};
const URL = URLs.local;


gideonApp = angular.module('gideonApp', ['ngMaterial', 'ngMessages']).config(($mdThemingProvider) => {
    // Set the colors of the website for ngMaterial
    $mdThemingProvider.definePalette('black', $mdThemingProvider.extendPalette('grey', {
        '500': '#000000'
    }));
    $mdThemingProvider.definePalette('gold', $mdThemingProvider.extendPalette('amber', {
        '500': '#FFD700'
    }));
    $mdThemingProvider.definePalette('pastelred', $mdThemingProvider.extendPalette('red', {
        '500': '#FF5A5A'
    }));
    $mdThemingProvider.theme('default')
        .primaryPalette('black')
        .accentPalette('gold')
        .warnPalette('pastelred');
});



let currentUsername = "";
let loggedIn = false;

// The header goes on nearly every page, so its controller is here
gideonApp.controller('header', ($scope, $http) => {
    
    // Get the login status of the current user
    $http.get(`${URL}getUser`).then((response) => {
        currentUsername = response.data[0];
        loggedIn = (response.data != "");
        
        $scope.currentUsername = currentUsername;
        $scope.loggedIn = loggedIn;
        

        if (loggedIn) {
            // Every 10 seconds, check if the currently logged in user has terminated
            setInterval(() => {
                $http.get(`${URL}checkIfTerminated`).then((response) => {
                    // If the account has been compromised, force a reload
                    if (response.data > 0)
                        window.location.reload(true);
                    console.log("account still alive");
                })
            }, 10000);
        }
    });

    // Back button
    $scope.back = () => {
        window.history.back();
    }

    // Login button
    $scope.login = () => {
        window.location.href = "index.html";
    };

    // Logout button
    $scope.logout = () => {
		$http.get(`${URL}logout`)
		.then(_ => {
			window.location.href = "index.html";
		});
    };

    // Generic webpage load
    $scope.goTo = (href) => {
        window.location.href = href;
    };

    // Report button
    $scope.report = () => {
        window.open("https://github.com/Gamebot3/GideonStudentApp/issues");
    }
});
