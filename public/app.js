'use strict'

var app = angular.module('myApp', ['ngRoute']);


app.config(function ($routeProvider) {
	// Routing
	$routeProvider.
	when('/forside', {
		templateUrl: 'views/forside.html',
		controller: 'mainController'
	}).
	
	when('/omOs', {
		templateUrl: 'views/omOs.html',
		controller: 'mainController'
	}).
	when('/tidligereArbejde', {
		templateUrl: 'views/tidligereArbejde.html',
		controller: 'mainController'
	}).
	when('/prisUdregning', {
		templateUrl: 'views/prisUdregning.html',
		controller: 'mainController'
	}).
	when('/kontakt', {
		templateUrl: 'views/kontakt.html',
		controller: 'mainController'
	}).
	otherwise({
		redirectTo: '/'
	});
	
});


app.controller('mainController', function($scope, $http) {
	console.log('hello from angular controller');
});