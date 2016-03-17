app.controller("MapPage", function($scope, $rootScope, $routeParams, $http, NgMap) {
    window.scope = $scope;
    $scope.loading = false;

    $scope.map = (document.getElementById('map'));
    $scope.mapCircle = (document.getElementById('circles'));

    $scope.mapData = {
        center : "37.7756, -122.4193"
    };
    $scope.mapData.markers = 
        [{
            
        },
        {

        }]
    $scope.mapData.circle = {
        center : "37.7756, -122.4193",
        radius : 500,
        strokeColor: '#32839C',
        strokeOpacity: 0.6,
        strokeWeight: 2,
        fillColor: '#519BB4',
        fillOpacity: 0.30,
    };

    $scope.searchForm = {};
    $scope.searchForm.distances = [500,750,1000, 1250, 1500];

    
    $scope.queueSearch = function(query) {
        console.log(query);
        // add a spinner gif to the page
    	$http.get("/apiGet?q="+query);
        $scope.loading = true;

        // use setTimeout to make another request after .5 seconds
        setTimeout( function() {
            $http.get("/searchResults?q="+query).then(function(results) {
                /* THIS IS THE RESULT OF THE DATABASE CALL. IT DOES NOT FILTER DUPLICATE SEARCHES/RESULTS*/
                var res = theGreaterParser(results)
                $scope.results = [res[random(res)], res[random(res)], res[random(res)]]
                console.log($scope.results);
            });
            $scope.loading = false;
        },2000);
    }
});