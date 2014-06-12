'use strict'
var suntube = angular.module('suntube');
suntube.controller('searchController', ['$scope', '$resource', '$sce', 'SearchService', function($scope, $resource, $sce, SearchService){
	$scope.videos = undefined;
	
	$scope.searchDataLoaded = function(searchText, searchResult){
		$scope.videos = searchResult;
		if(searchResult && searchResult.length <= 0){
			$scope.searchText = "No Result Found For: " + searchText;
		} else {
			$scope.searchText = "Search Result For" + searchText;
		}
		// Uncomment to hide video, Audio will still go o n LOL!!
		//$scope.videoClicked = false;
	};
	$scope.videoClicked = undefined;
	$scope.click = function($event){
		$event.preventDefault();
		$scope.videoClicked = this.video._id;
		var videos  = $scope.videos;
		var id;
		for(var i =0 ; i< videos.length ; i++){
			id = videos[i]._id;
			if(this.video._id === id){
				$scope.video = videos[i];
				$scope.sources = [{src: $sce.trustAsResourceUrl(videos[i].videopath), type: "video/mp4"}];
				break;
			}
		}
	};	
}]);

suntube.controller('loginCtrl', ['$scope', '$resource', function($scope, $resource){
	
	$scope.username = "";
	$scope.password = "";
	var user = $resource('http://10.253.80.144:9768/login'/*, {login:{method:'POST'}}*/);
	$scope.loginFn = function (){
		user.get();
		//console.log(result);
		console.log("Calling login, username " + $scope.username + " password " + $scope.password);
		//console.log("Calling login");
	};
}]);