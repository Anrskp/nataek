'use strict'

var app = angular.module('myApp', ['ngRoute']);


app.config(function ($routeProvider, $locationProvider) {

	// Routing
	$routeProvider.
	when('/', {
		templateUrl: 'views/forside.html',
		controller: 'frontpageController'
	}).
	when('/omOs', {
		templateUrl: 'views/omOs.html',
		controller: 'aboutUsController'
	}).
	when('/billeder', {
		templateUrl: 'views/billeder.html',
		controller: 'imageController'
	}).
	when('/prisUdregning', {
		templateUrl: 'views/prisUdregning.html',
		controller: 'priceController'
	}).
	when('/kontakt', {
		templateUrl: 'views/kontakt.html',
		controller: 'mainController'
	}).
	when('/admin', {
		templateUrl: 'views/admin.html',
		controller: 'adminController'
	}).
	when('/adminLogin', {
		templateUrl: 'views/adminLogin.html',
		controller: 'adminLoginController.html'
	}).
	otherwise({
		redirectTo: '/'
	});


//TODO:  SET BASE 
/*
	$locationProvider.html5Mode({
  	enabled: true
	});
	*/
});

// TODO MOVE TO OWN FOLDER
// CONTROLLERS

// MAIN CONTROLLER 
app.controller('mainController', function($scope, $http) {
	console.log('hello from main controller');

	$scope.email = "";
	$scope.number = "";

	//get contact info
	$http({
		method: 'get',
		url: '/api/getContactInfo'
	}).then(function succesCallback(response) {
		$scope.email = response.data.email;
		$scope.number = response.data.number;
	})

});


// FRONTPAGE CONTROLLER 
app.controller('frontpageController', function($scope, $http) {

	// Get frontpage text
	$http({
		method: 'get',
		url: '/api/getFrontpageTxt'
	}).then(function succesCallback(response) {
		$scope.frontpageTxt = response.data;

	}, function errorCallback(response) {
		console.log(response);
	});

});


// ABOUT US CONTROLLER 
app.controller('aboutUsController', function($scope, $http) {
	console.log('hello from main controller');

	$http({
		method: 'get',
		url: '/api/getAboutUsTxt'
	}).then(function succesCallback(response) {
		$scope.aboutUsText = response.data;

	}, function errorCallback(response) {
		console.log(response);
	})

});


// PRICE CALC. CONTROLLER
app.controller('priceController', function($scope, $http) {

	// ng-models for clients input (house width and length)
	$scope.houseWidth = "";
  $scope.houseLength = "";
	
	// initate starting price at zero
	$scope.currentPrice = 0;

	// get prices
	$http({
		method: 'get',
		url: '/api/getPrices'
	}).then(function succesCallback(response) {
		$scope.prices = response.data;

	}), function errorCallback(response) {
		console.log(response);
	}

	// Calculate clients price.
	$scope.calcPrice = function() {
		var lengthPrice = $scope.prices.lengthPrice;
		var widthPrice = $scope.prices.widthPrice;
		
		//convert comma to dot for float numbers.
		$scope.houseLength = $scope.houseLength.replace(',','.');
		$scope.houseWidth = $scope.houseWidth.replace(',','.');
		
		// result
		$scope.currentPrice = +($scope.houseLength * lengthPrice) + +($scope.houseWidth * widthPrice);

	}
});


// IMAGE CONTROLLER
app.controller('imageController', function($scope, $http) {

	$scope.imageSrcArray = [];

	$http({
		method: 'get',
		url: '/api/getImages'
	}).then(function succesCallback(response) {
		var data = response.data;
		
			// make nested array for nested ng-repeat for bootstrap rows / cols.
			while(data.length > 0) {
				var	chunk = data.splice(0,3);
				$scope.imageSrcArray.push(chunk);
			} 
		}, function errorCallback(response) {
			console.log(response);
		});


});


// LOGIN CONTROLLER
app.controller('loginController', function($scope, $http) {
	console.log('hello from login controller');
});


// ADMIN CONTROLLER
app.controller('adminController', function($scope, $http, $location) {	
	
	// authCheck
	var loggedIn = true;
	if(!loggedIn) {
		$location.path("/");
	}

	//ng-model to edit frontpage textarea
	$scope.frontPageTextModel = "";
  $scope.aboutUsTextModel = "";

  //ng-model for prices
  $scope.widthPriceModel = "";
  $scope.lengthPriceModel = "";

  //ng model for contact info
  $scope.emailModel = "";
  $scope.phoneNumberModel = "";


	// update frontpage text
	$scope.updateFrontpageTxt = function() {

		var textToUpdate = {
			text: $scope.frontPageTextModel
		};

		// todo - catch errors
		$http.post('/api/updateFrontpageTxt', textToUpdate).then(function(succes) {
			console.log('updated frontpagetext succesfully!');
		});
	};

	// update about us text
	$scope.updateAboutUsTxt = function() {

		var textToUpdate = {
			text: $scope.aboutUsTextModel
		}

		$http.post('/api/updateAboutUsTxt', textToUpdate).then(function(succes) {
			console.log('updated aboutUstext succesfully!')
		});
	};
	
	// update kontakt info
	$scope.updateContactInfo = function() {
		var newContactInfo = {
			email: $scope.emailModel,
			number: $scope.phoneNumberModel
		};

		$http.post('/api/updateContactInfo', newContactInfo).then(function(succes) {
			console.log('updated contactinfo succesfully');	
		})

	};

	// update prices
	$scope.updatePrices = function() {
		var newPrices = {
			widthPrice: $scope.widthPriceModel,
			lengthPrice: $scope.lengthPriceModel
		}

		$http.post('/api/updatePrices', newPrices).then(function(succes) {
			console.log('updated prices succesfully')
		})
	}

});
