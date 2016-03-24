app.controller("MapPage", function($scope, $rootScope, $routeParams, $http, NgMap) {
    window.scope = $scope;
    $scope.loading = false;
    var garageMarker,
        marker;

    $scope.getLocation = function(results, status) {
        marker=null;
        $scope.map.setCenter(this.getPlace().geometry.location);
        $scope.mapData.circle.center = this.getPlace().geometry.location;
            marker = new google.maps.Marker({
            position: this.getPlace().geometry.location,
            map: $scope.map,
            title: "Current Location",
            animation: google.maps.Animation.drop,
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/112-purple.png&scale=1.0",
        })
    }

    $scope.mapData = {
        center : "37.7756, -122.4193"
    };

    // $scope.distanceMeters = Number($scope.distance);

    $scope.mapData.circle = {
        center : $scope.mapData.center,
        radius : 0,
        strokeColor: '#32839C',
        strokeOpacity: 0.3,
        strokeWeight: .5,
        fillColor: '#519BB4',
        fillOpacity: 0.30,
    };

    $scope.changeRadius = function () {
        if ($scope.query != undefined)
            $scope.mapData.circle.radius = parseInt($scope.distance) * 0.3048
    }

    $scope.searchForm = {};
    $scope.searchForm.distances = [500, 1000, 1500, 2000, 2500];
    $scope.queueSearch = function(query) {
        var dist = parseInt($scope.distance);
        console.log(query);
        console.log(dist);
    	$http.get("/apiGet?q="+query+"&dist="+dist).then(function(response) {
            $scope.currentResults = response.data;
            $scope.parkingList = [];
            $scope.allMarkers = [];
            if (response.data.parking_listings != 0) {
                for (var i = 0; i < response.data.parking_listings.length; i++) {
                    if (response.data.parking_listings[i].distance <= dist) {
                        var resultObj = response.data.parking_listings[i];
                        resultObj.selected = false;
                        resultObj.iter = i;
                        $scope.parkingList.push(resultObj);

                        garageMarker = new google.maps.Marker({
                            position: {lat: response.data.parking_listings[i].lat, lng: response.data.parking_listings[i].lng},
                            map: $scope.map,
                            title: response.data.parking_listings[i].location_name,
                            animation: google.maps.Animation.DROP,
                            icon: "https://portovenere.a-turist.com/images/google_marker_violet.png",
                        }).addListener('click', generateMarkerCB(garageMarker, $scope.parkingList[i]));
                        garageMarker.iter = i;
                        $scope.allMarkers.push(garageMarker);
                        
                    }
                };
            }
        }, function (err) {
            console.log(err);
        });
        $scope.loading = true;
    }


    NgMap.getMap().then(function(map) {
        $scope.map = map;
    });


    $scope.selectGarage = function (listItem) {
        console.log($scope.allMarkers[listItem.iter]);
    }


    function generateMarkerCB(marker, obj) {
        return function(garage) {
            obj.selected = !(obj.selected);
            $scope.$apply();
       }
    }
});



