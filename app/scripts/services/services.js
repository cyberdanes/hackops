'use strict'
var suntube = angular.module('suntube');
suntube.factory('SearchService', ['$resource', function($resource){
	var SearchService = {};

	var searchVideoResource = $resource('http://10.253.80.246:3000/searchvideo');

	SearchService.searchVieos = function(searchText){
		return searchVideoResource.query({ searchText: searchText});
	}

	return SearchService;
}]);