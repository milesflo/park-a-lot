app.controller("Landing", function($scope, $rootScope, $routeParams, $http) {
    window.scope = $scope;
    $scope.eventCategories = [""];
    $scope.loading = false;
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