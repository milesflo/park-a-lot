app.controller("MapPage", function($scope, $rootScope, $routeParams, $http, NgMap) {
    window.scope = $scope;
    $scope.loading = false;


    $scope.getLocation = function(results, status) {
        if (marker) { marker.position = ""; }
        $scope.map.setCenter(this.getPlace().geometry.location);
        $scope.mapData.circle.center = this.getPlace().geometry.location;
        var marker = new google.maps.Marker({
            position: this.getPlace().geometry.location,
            map: $scope.map,
            title: "Current Location",
            animation: google.maps.Animation.BOUNCE
        })
        console.log(marker);
    }

    $scope.mapData = {
        center : "37.7756, -122.4193"
    };

    $scope.mapData.markers =
        [{
            position : "",
            animation: google.maps.Animation.DROP,
            draggable: false
        }];

    // $scope.distanceMeters = Number($scope.distance);

    $scope.mapData.circle = {
        center : $scope.mapData.center,
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

    $scope.searchForm = {};
    $scope.searchForm.distances = [500, 1000, 1500, 2000, 2500];
    
    $scope.queueSearch = function(query,dist) {
        console.log(query);
        console.log(dist);
    	$http.get("/apiGet?q="+query+"&dist="+parseInt(dist)).then(function(response) {
            $scope.currentResults = response.data;
            console.log(response.data);
            for (var i = 0; i < response.data.parking_listings; i++) {
                var resultObj = response.data.parking_listings[i];
                new google.maps.Marker({
                    position: [resultObj.lat,resultObj.lng],
                    map: $scope.map,
                    title: "Current Location",
                    animation: google.maps.Animation.DROP
                })
            };
        }, function (err) {
            console.log(err);
        });
        $scope.loading = true;
    }


  NgMap.getMap().then(function(map) {
    $scope.map = map;
  });

});

