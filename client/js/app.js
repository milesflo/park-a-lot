var app = angular.module("parkALot", ["ngRoute", "ngAnimate"]);

app.config(function($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider
   	.otherwise({
	 	redirectTo: "/"
	});
});

