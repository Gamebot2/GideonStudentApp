gideonApp.controller('homeCtrl', ($scope, $http, $window) => {

	// initialize Verify
	Verify.setScope($scope);

	$scope.login = () => {
		if (!Verify.errorIf($scope.username != "Ansh" || $scope.password != "Jain", "Username and/or password not recognized."))
			window.location.href = "StudentList.html";
	}

});