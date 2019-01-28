gideonApp.controller('homeCtrl', ($scope, $http, $window) => {

	// initialize Verify
	Verify.setScope($scope);

	$scope.login = () => {
		$http.get(`${URL}login?user=${$scope.username}&pass=${$scope.password}`)
		.then(response => {
			if (!Verify.errorIf(response.data < 0, "Username and/or password not recognized."))
				window.location.href = "StudentList.html";
		});
	}

	$scope.guest = () => {
		$http.get(`${URL}logout`)
		.then(response => {
			if (!Verify.errorIf(response.data < 0, "Error"))
				window.location.href = "StudentList.html";
		});
	}

	$scope.register = () => {
		$http.get(`${URL}register?user=${$scope.username}&pass=${$scope.password}`).then(_ => {});
	}

});