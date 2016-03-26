app.controller("MapPage", function($scope, $rootScope, $routeParams, $http, NgMap) {
    window.scope = $scope;
    $scope.loading = false;
    var garageMarker,
        marker;

    NgMap.getMap().then(function(map) {
        $scope.map =  new google.maps.Map(document.getElementById('map'), {
          center: {lat: 37.7756, lng: -122.4193},
          zoom: 8
        });
    });

    $scope.bestDeal = {
        price: Infinity,
        iter: "",
    }

    $scope.getLocation = function(results, status) {
        if (marker) marker.setMap(null);
        $scope.map.setCenter(this.getPlace().geometry.location);
        $scope.mapData.circle.center = this.getPlace().geometry.location;
            marker = new google.maps.Marker({
            position: this.getPlace().geometry.location,
            map: $scope.map,
            title: "Current Location",
            animation: google.maps.Animation.drop,
            icon: "https://mt.googleapis.com/vt/icon/name=icons/onion/112-purple.png&scale=1.0",
        });
    }

    $scope.mapData = {
        center : "37.7756, -122.4193",
        zoom : 13
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
            $scope.mapData.circle.radius = parseInt($scope.distance) * 0.3048;
    }

    $scope.searchForm = {};
    $scope.searchForm.distances = [500, 1000, 1500, 2000, 2500];
    $scope.queueSearch = function(query) {
        if ($scope.allMarkers) {
            for (var n = 0; n < $scope.allMarkers.length; n++) {
                $scope.allMarkers[n].setMap(null);
            }
        }
        var dist = parseInt($scope.distance);
    	$http.get("/apiGet?q="+query+"&dist="+dist).then(function(response) {
            $scope.currentResults = response.data;
            $scope.parkingList = [];
            $scope.allMarkers = [];
            $scope.mapData.zoom = 15;
            if (response.data.parking_listings != 0) {
                for (var i = 0; i < response.data.parking_listings.length; i++) {
                    if (response.data.parking_listings[i].distance <= dist) {
                        var resultObj = response.data.parking_listings[i];
                        resultObj.iter = i;
                        $scope.parkingList.push(resultObj);

                        garageMarker = new google.maps.Marker({
                            position: {lat: $scope.parkingList[i].lat, lng: $scope.parkingList[i].lng},
                            map: $scope.map,
                            title: $scope.parkingList[i].location_name,
                            animation: google.maps.Animation.DROP,
                            icon: "https://portovenere.a-turist.com/images/google_marker_violet.png",
                        });
                        garageMarker.addListener('click', generateMarkerCB(garageMarker, $scope.parkingList[i]));
                        garageMarker.iter = i;

                        if ($scope.parkingList[i].price < $scope.bestDeal.price) {
                            $scope.bestDeal.price = $scope.parkingList[i].price
                            $scope.bestDeal.iter = garageMarker.iter;
                        }

                        $scope.allMarkers.push(garageMarker);
                        
                    }
                };
                $scope.allMarkers[$scope.bestDeal.iter].setIcon("http://maps.gpsvisualizer.com/google_maps/icons/google/green.png");
            }
        }, function (err) {
            console.log(err);
        });
        $scope.loading = true;
    }

    $scope.highlightIn = function (listItem) {
        $scope.selected = listItem.iter;
    }

    $scope.highlightOut = function (listItem) {
        $scope.selected = undefined;
    }


    $scope.bounceIn = function (listItem) {
        $scope.allMarkers[listItem.iter].setAnimation(google.maps.Animation.BOUNCE);
        
        console.log(listItem);
    }

    $scope.bounceOut = function (listItem) {
        $scope.allMarkers[listItem.iter].setAnimation(null);
       
    }


    function generateMarkerCB(marker, obj) {
        return function(garage) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            $scope.selected = obj.iter;

            setInterval(function() {
                marker.setAnimation(undefined);
                $scope.selected = undefined;
            }, 3000);

            $scope.$apply();
       }
    }
});

