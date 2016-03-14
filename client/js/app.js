var app = angular.module("parksALot", ["ngRoute", "ngAnimate"]);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider
	.when('/', {
		templateUrl: "/client/views/templates/landing.html",
		controller: "Landing"
	})
	.when('/map', {
		templateUrl: "/client/views/templates/map.html",
		controller: "Map"
	})
   	.otherwise({
	 	redirectTo: "/"
	});
});

