var searchPetsApp = angular.module('searchPetsApp', ['ngRoute']);

// Service for api request
searchPetsApp.factory('weThePeopleAPI', function($http, $q) {
	var service = {};
	var baseUrl = 'https://api.whitehouse.gov/v1/petitions.json?title=';
	var searchTitle = '';
	var finalUrl = '';

	var prepareRequest = function() {
		searchTitle = searchTitle.split(' ').join('+');
		finalUrl = baseUrl + searchTitle;
		return finalUrl;
	};

	service.setSearchTitle = function(val) {
		searchTitle = val;
	};

	service.setResults = function(resultsInput) {
		results = resultsInput;
	} 

	service.getResults = function() {
		return results;
	};

	service.sendRequest = function() {
		var deferred = $q.defer();
		prepareRequest();
		$http({
			method: 'GET',
			url: finalUrl
		}).success(function(data) {
			deferred.resolve(data);
		}).error(function() {
			deferred.reject("There was an error!");
		});

		return deferred.promise;
	};

	return service;
});

searchPetsApp.config(function($routeProvider) {
	$routeProvider
		
		// Search Page (Home)
		.when('/', {
			templateUrl: 'assets/templates/search.html',
			controller: 'mainController'
		})

		// Results Page
		.when('/results', {
			templateUrl: 'assets/templates/results.html',
			controller: 'resultsController'
		});
});

// Main Controller
searchPetsApp.controller('mainController', function($scope, $window, weThePeopleAPI) {
	// Script to make enter key work
	$("#search_box").keyup(function(event) {
		if(event.keyCode == 13) {
			$("#search_button").click();
		}
	});
	
	$scope.search = function() {
		if($scope.searchVal != null) {
			weThePeopleAPI.setSearchTitle($scope.searchVal);
			$window.location.href="/searchpets/#/results";
		}
	};
});

// Results Controller
searchPetsApp.controller('resultsController', function($scope, weThePeopleAPI) {
	weThePeopleAPI.sendRequest().then(function(response) {
			$scope.results = response.results;
	});
});