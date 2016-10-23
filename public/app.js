'use strict'

var app = angular.module('myApp', ['ngRoute']);


app.config(function ($routeProvider, $locationProvider) {

	// Routing
	$routeProvider.
	when('/', {
		templateUrl: 'views/forside.html',
}).
	when('/omOs', {
		templateUrl: 'views/omOs.html',
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
	when('/adminLogin', {
		templateUrl: 'views/adminLogin.html',
		controller: 'loginController'
	}).
	when('/admin', {
		templateUrl: 'views/admin.html',
		controller: 'adminController',
		
		// check if user is logged in, else redirect to login view. 
		resolve: {
			check: function($location, $rootScope) {
				if(!$rootScope.loggedIn) {
					$location.path('/adminLogin');
				}
			}
		}
	}).
	otherwise({
		redirectTo: '/'
	});

});

// CONTROLLERS

// MAIN CONTROLLER 
app.controller('mainController', function($scope, $http) {

	$scope.email = "";
	$scope.number = "";

	// Initiate data.

	// Get contact info
	$http({
		method: 'get',
		url: '/api/getContactInfo'
	}).then(function succesCallback(response) {
		$scope.email = response.data.email;
		$scope.number = response.data.number;
	}), function errorCallback(response) {
		console.log(response);
	}

	// Get frontpage text
	$http({
		method: 'get',
		url: '/api/getFrontpageTxt'
	}).then(function succesCallback(response) {
		$scope.frontpageTxt = response.data;

	}, function errorCallback(response) {
		console.log(response);
	});

	// Get about us text
	$http({
		method: 'get',
		url: '/api/getAboutUsTxt'
	}).then(function succesCallback(response) {
		$scope.aboutUsText = response.data;

	}, function errorCallback(response) {
		console.log(response);
	});

	// Get prices
	$http({
		method: 'get',
		url: '/api/getPrices'
	}).then(function succesCallback(response) {
		$scope.prices = response.data;

	}), function errorCallback(response) {
		console.log(response);
	}

	// Get images
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

// PRICE CALC. CONTROLLER
app.controller('priceController', function($scope, $http) {

	// ng-models for clients input (house kvm and length)
	$scope.houseKvm = "";
	$scope.houseLength = "";
	
	// initate starting price at zero
	$scope.currentPrice = 0;

	// Calculate clients price.
	$scope.calcPrice = function() {
		var lengthPrice = $scope.prices.lengthPrice;
		var kvmPrice = $scope.prices.kvmPrice;
		console.log($scope.prices)		
		//convert comma to dot for float numbers.
		$scope.houseLength = $scope.houseLength.replace(',','.');
		$scope.houseKvm = $scope.houseKvm.replace(',','.');

		console.log(kvmPrice, lengthPrice, $scope.houseKvm, $scope.houseLength)
		// result
		$scope.currentPrice = +($scope.houseLength * lengthPrice) + +($scope.houseKvm * kvmPrice);
	}
});


// LOGIN CONTROLLER
app.controller('loginController', function($scope, $http, $location, $rootScope) {

	$scope.login = function() {
		
		var userLogin = {
			username: $scope.username,
			password: $scope.password
		};
		
		$http.post('/api/login', userLogin).then(function(succes) {

			if(succes.data) {
				$rootScope.loggedIn = true;
				$location.path('/admin'); 
			} else {
				alert('wrong password or username.')
			}
		}, function(err) {
			console.log(err)
		});
	};

});


// ADMIN CONTROLLER
app.controller('adminController', function($scope, $http, $location) {	
	

	// insert editable text in textarea.
	$scope.frontPageTextModel = $scope.frontpageTxt;
	$scope.aboutUsTextModel = $scope.aboutUsText;


  // ng-model for prices
  $scope.kvmPriceModel = $scope.prices.kvmPrice;
  $scope.lengthPriceModel = $scope.prices.lengthPrice;

  // ng model for contact info
  $scope.emailModel = $scope.email;
  $scope.phoneNumberModel = $scope.number;
  

  $scope.aboutUsUpdated = {
  	updated: false,
  	msg: ""
  };

  $scope.frontpageUpdated = {
  	updated: false,
  	msg: ""

  };
  
  $scope.pricesUpdated = {
  	updated: false,
  	msg: ""

  };

  $scope.contactInfoUpdated = {
  	updated: false,
  	msg: ""

  };

	// update frontpage text
	$scope.updateFrontpageTxt = function() {
		if($scope.frontPageTextModel == "") {
			$scope.frontpageUpdated.updated = true;
			$scope.frontpageUpdated.msg = "the text area is empty"
			return 0;
		}

		var textToUpdate = {
			text: $scope.frontPageTextModel
		};

		$http.post('/api/updateFrontpageTxt', textToUpdate).then(function(succes) {
			console.log('updated frontpagetext succesfully!');
			$scope.frontpageUpdated.updated = true;
			$scope.frontpageUpdated.msg = "updated succesfully"
		}, function(err) {
			console.log(err);
		});
	};

	// update about us text
	$scope.updateAboutUsTxt = function() {
		if($scope.aboutUsTextModel == "") {
			$scope.aboutUsUpdated.updated = true;
			$scope.aboutUsUpdated.msg = "the text area is empty"
			return 0;
		}

		var textToUpdate = {
			text: $scope.aboutUsTextModel
		}

		$http.post('/api/updateAboutUsTxt', textToUpdate).then(function(succes) {
			console.log('updated aboutUstext succesfully!')
			$scope.aboutUsUpdated.updated = true;
			$scope.aboutUsUpdated.msg = 'updated succesfully';
		}, function(err) {
			console.log(err);
		});
	};
	
	// update contact info
	$scope.updateContactInfo = function() {
		if($scope.emailModel == "" || $scope.phoneNumberModel == "") {
			$scope.contactInfoUpdated.updated = true;
			$scope.contactInfoUpdated.msg = 'email or number is empty!'
			return 0;
		}

		var newContactInfo = {
			email: $scope.emailModel,
			number: $scope.phoneNumberModel
		};

		$http.post('/api/updateContactInfo', newContactInfo).then(function(succes) {
			console.log('updated contactinfo succesfully');
			$scope.contactInfoUpdated.updated = true;	
			$scope.contactInfoUpdated.msg = 'updated succesfully';
		}, function(err) {
			console.log(err);
		});
	};

	// update prices
	$scope.updatePrices = function() {
		
		if($scope.KvmPriceModel == "" || $scope.lengthPriceModel == "") {
			$scope.pricesUpdated.updated = true;
			$scope.pricesUpdated.msg = 'length or width price is empty!';
			return 0;
		}

		$scope.KvmPriceModel = $scope.KvmPriceModel.replace(',','.');
		$scope.lengthPriceModel = $scope.lengthPriceModel.replace(',','.');

		var newPrices = {
			widthPrice: $scope.KvmPriceModel,
			lengthPrice: $scope.lengthPriceModel
		}

		$http.post('/api/updatePrices', newPrices).then(function(succes) {
			console.log('updated prices succesfully')
			$scope.pricesUpdated.updated = true;
			$scope.pricesUpdated.msg = 'updated succesfully';
		}, function(err) {
			console.log(err);
		})
	}

	// delete image
	$scope.deleteImage = function(imageSrc) {
		
		var imageToDelete = {
			src: imageSrc
		};

		$http.post('/api/deleteImage', imageToDelete).then(function(succes) {
			console.log('succes');
		}, function(err) {
			console.log(err)
		});

		// Remove thumbnail and delete button
		var thumbnail = document.getElementById(imageSrc),
		thumbnailbtn = document.getElementById('btn'+imageSrc);

		thumbnail.parentNode.removeChild(thumbnail);
		thumbnailbtn.parentNode.removeChild(thumbnailbtn);
	}

});