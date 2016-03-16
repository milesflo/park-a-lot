app.directive('mapbox', [
  function () {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        callback: "="
      },
      template: '<div></div>',
      link: function (scope, element, attributes) {
        L.mapbox.accessToken = 'YOUR PUBLIC MAPBOX KEY';
        var map = L.mapbox.map(element[0], 'YOUR MAP PROJECT ID');
        scope.callback(map);
      }
    };
  }
]);