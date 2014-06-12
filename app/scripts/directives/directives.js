'use strict'
var suntube = angular.module('suntube');

suntube.directive('stBanner', ['$resource', function($resource){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<nav id="banner" class="navbar navbar-default navbar-fixed-top" role="navigation">' + 
                        '<div class="row" style="margin-left: 20px; margin-right: 20px;">' + 
                        '<div> <a class="navbar-brand">Sungard</a></div>'+
                        '<div class="pull-right">' + 
                            '<ul class="nav navbar-nav"> ' + 
                            ' <li class="nav"><a>Login</a></li> ' + 
                            ' </ul></div></div></nav>',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            
        }
    };
}]);

suntube.directive('stNavigator', ['$resource','SearchService', function($resource, SearchService){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        controller: function($scope, $element, $attrs, $transclude) { 
            var onSearchCallBack = $attrs.stOnSearch;

            $scope.searchFn = function (searchText){
                console.log("Calling search");
                 var searchCriteria;
                if(searchText){
                    searchCriteria = searchText;
                } else {
                   searchCriteria = $scope.navSearchText
                }
                
                SearchService.searchVieos(searchCriteria).$promise.then(function(videos){
                    console.log("Dekha");
                    console.log(videos);
                    var callbackFunction = $scope[onSearchCallBack];
                    callbackFunction(searchCriteria,videos);
                })
            };

            this.searchFn = $scope.searchFn;
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<header id="header" class="container"> '+
            '<div id="menu-bar" class="navbar navbar-default">'+
                '<div class="navbar-header">' + 
                      '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#menu-items">' + 
                       '<span class="glyphicon glyphicon-chevron-down"></span>'+
                      '</button>' +
                      '<a class="navbar-brand" href="#">Suntube</a>' +
                '</div>' +
                '<div id="menu-items" class="navbar-collapse collapse">'+
                    '<ul class="nav navbar-nav">' +
                        '<li class="nav active"><a href=".">Home</a></li>' + 
                        '<li class="nav"><a href=".">Products</a></li>' + 
                        '<li class="nav"><a href=".">Technical</a></li>' +
                    '</ul>' +
                    '<div class="navbar-form" role="search">' +
                        '<div class="input-group">' +
                            '<input type="text" ng-model="navSearchText" class="form-control" data-st-auto-complete="hello" placeholder="Search Videos">' + 
                            '<span class="input-group-addon"><span ng-click="searchFn()" class="glyphicon glyphicon-search"/></span>' +
                        '</div>' +
                    '</div>' + 
                '</div><div id="submenu"></div>' +
            '</div>' +
        '</header>',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, element, attrs, controller) {
           
        }
    };
}]);
suntube.directive("vgSrc",   function () {
        return {
            restrict: "A",
            link: {
                pre: function (scope, elem, attr) {
                    var element = elem;
                    var sources;
                    var canPlay;

                    function changeSource() {
                        if(!sources){
                            return;
                        }
                        for (var i = 0, l = sources.length; i < l; i++) {
                            canPlay = element[0].canPlayType(sources[i].type);

                            if (canPlay == "maybe" || canPlay == "probably") {
                                element.attr("src", sources[i].src);
                                element.attr("type", sources[i].type);
                                break;
                            }
                        }

                        if (canPlay == "") {
                            scope.$emit("onVideoError", {type: "Can't play file"})
                        }
                    }

                    scope.$watch(attr.vgSrc, function (newValue, oldValue) {
                        if (!sources || newValue != oldValue) {
                            sources = newValue;
                            changeSource();
                        }
                    });
                }
            }
        }
    }
);

suntube.directive('stVideoPlayer', function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div id="video-content" ng-show="videoClicked" class="row">'+
                '<div class="col-sm-7 col-md-9" style="margin-botton: 60px">' +
                    '<div style="padding: 10px">' + 
                        '<h4><p>{{video.videotitle}}</p></h4>' + 
                    '</div>' + 
                    '<div style="cursor: pointer">' + 
                        '<video vg-src="sources" height="500px" controls autoplay></video>' +
                        '<div class="caption">' +
                        '</div></div></div></div>',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            
        }
    };
});

suntube.directive('stAutoComplete', ['$resource', function($resource){
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        require: '^stNavigator', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        template: '',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, element, attrs, controller) {
            var restPath = attrs.stAutoComplete;
            $(element).bind('keydown', function(event){
                if ( event.keyCode === $.ui.keyCode.TAB &&  $( this ).data( "ui-autocomplete" ).menu.active ) {
                     event.preventDefault();
                }
            }).autocomplete({
                source: 'http://10.253.80.246:3000/typeahead',
                minLength: 3,
                focus: function(){
                    // prevent value inserted on focus
                    return false;
                },
                select: function(event, ui){
                    /*if($scope.searchFn){
                        $scope.searchFn(ui.item.value); 
                    };*/
                    controller.searchFn(ui.item.value);
                }
            });
        }
    };
}]);