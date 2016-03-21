app.controller("MapPage", function($scope, $rootScope, $routeParams, $http, NgMap) {
    window.scope = $scope;
    $scope.loading = false;

    $scope.tester = function(results, status) {
        console.log('.')
        console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            console.log('true')
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }

    $scope.mapData = {
        center : "37.7756, -122.4193"
    };

    $scope.mapData.targetLocation =
        [{

            position : $scope.mapData.center,
            animation: google.maps.Animation.DROP,
            draggable: true
        }];

    $scope.mapData.markers =
        [{
            position : "",
            animation: google.maps.Animation.DROP,
            draggable: false
        }];

    // $scope.distanceMeters = Number($scope.distance);

    $scope.mapData.circle = {
        center : $scope.mapData.targetLocation[0].position,
        radius : 0,
        strokeColor: '#32839C',
        strokeOpacity: 0.6,
        strokeWeight: .5,
        fillColor: '#519BB4',
        fillOpacity: 0.30,
    };

    $scope.changeRadius = function () {
        console.log(".")
        $scope.mapData.circle.radius = parseInt($scope.distance) * 0.3048
    }

    $scope.updateCircle = function() {
        console.log($scope.mapData.targetLocation[0])
        $scope.mapData.circle.center = $scope.mapData.targetLocation[0].position;
    }

    $scope.searchForm = {};
    $scope.searchForm.distances = [500, 1000, 1500, 2000, 2500];

    
    $scope.queueSearch = function(query,dist) {
        console.log(query);
        console.log(dist);
        // add a spinner gif to the page
    	$http.get("/apiGet?q="+query+"&dist="+parseInt($scope.distance));
        $scope.loading = true;

        // use setTimeout to make another request after .5 seconds
        setTimeout( function() {
            $http.get("/searchResults?q="+query).then(function(results) {
                $scope.loading = false;
            },2000);
        })
    }
});

