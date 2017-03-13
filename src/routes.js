angular
  .module('app')
  .config(routesConfig)
  .controller('homeCon', function() {
    console.log('Home controller');
  })
  .controller('reportCon', function($scope) {
    console.log('Report controller');
	  // getReports();
    $scope.map = {
      center: {
        latitude: 10.450429,
        longitude: -61.314820
      },
      events:{
        dragstart: function(){
          console.log('moving map');
        },
        dragend: function($scope){
          console.log('moved map...');
          console.log(markers);
        }
      },
      zoom: 9,
      pan: true,
      markers: []
    };
  })
  .controller('makereport1Con', function($scope) {
    console.log('Make report 1 controller');
  })
  .controller('makereport2Con', function($scope) {
    console.log('Make report 2 controller');
    // Map
    $scope.map = {
      center: {
        latitude: 10.450429,
        longitude: -61.314820
      },
      markers: [],
      zoom: 9,
      events:{
        dragstart: function(){
          console.log('moving map');
        },
        dragend: function(markers){
          console.log('moved map...');

        }
      }
    };
    function makeMarker(lt, lg) {
      var marker = {
        id: Date.now(),
        coords: {
          latitude: lt,
          longitude: lg
        },
        events: {
          dragend: function (marker) {
            marker.coords = marker.model.coords;
            console.log('Coords:',marker.coords);
          },
          dragstart: function() {
            console.log('dragging now..');
          }
        }
      };
      return marker;
    }
    $scope.markerOptions = {
      draggable: true,
      icon: "/app/images/marker.png"
    };
    // Using geocoding
    $scope.getLocation2 = function() {
      var geocoder = new google.maps.Geocoder();
      var addr = document.getElementById('newAddress').value;
      geocoder.geocode({
        "address": addr
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location,
            lat = location.lat(),
            lng = location.lng();
          var marker = makeMarker(lat, lng);
          $scope.map.markers.pop(marker);
          $scope.map.markers.push(marker);
          $scope.$apply();
          console.log($scope.map.markers[0].coords);
        } else {
          console.log("Geocoding not supported");
        }
      });
    };
    //Using geolocation
    $scope.getLocation = function() {
      if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(showPosition);
      else
        alert('Geolocation is not supported by this browser.');
    };
    //Renders marker on the map
    function showPosition(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var marker = makeMarker(lat, lng);
      $scope.map.markers.pop(marker);
      $scope.map.markers.push(marker);
      $scope.$apply();
      console.log($scope.map.markers[0].coords);
    }
    $scope.getLatLng = function() {
      var lat = $scope.map.markers[0].coords.latitude;
      var lng = $scope.map.markers[0].coords.longitude;
      if (typeof(Storage) !== "undefined") {
  	    localStorage.setItem("lat",lat);
  			localStorage.setItem("lng", lng);
  		}
  		else {
  		    alert("Sorry, your browser does not support Web Storage...");
  		}
      console.log(lat,lng);
    };
  })
  .controller('makereport3Con', function($scope) {
    console.log('Make a report 3 controller');
  })
  .controller('makereport4Con', function($scope) {
    console.log('Make report4 controller');
    // localStorage.setItem("lat",10.4);
    // localStorage.setItem("lng",-61.3);
    $scope.markerOptions = {
      icon: "/app/images/marker.png"
    };
    $scope.map = {
      center: {
        latitude: localStorage.getItem("lat"),
        longitude: localStorage.getItem("lng")
      },
      zoom: 12,
      markers:[],
      events:{
          idle: function(){
            var marker = {
              id:1,
              coords:{
                latitude : localStorage.getItem("lat"),
                longitude : localStorage.getItem("lng")
              }
            };
            $scope.map.markers.push(marker);
            $scope.$apply();
          }
      }
    };

    document.getElementById("ca").innerHTML = localStorage.getItem("select");
    document.getElementById("tt").innerHTML = localStorage.getItem("title");
    document.getElementById("de").innerHTML = localStorage.getItem("desc");
    document.getElementById("regSumHeader").innerHTML += localStorage.getItem("region");
  })
  .controller('forumCon', function() {
    console.log('Forum controller');
	  getPost();
  })
  .controller('makepostCon', function($scope) {
    console.log('Make post controller');
    // Map
    $scope.map = {
      center: {
        latitude: 10.450429,
        longitude: -61.314820
      },
      markers: [],
      zoom: 9,
      events:{
        dragstart: function(){
          console.log('moving map');
        },
        dragend: function(markers){
          console.log('moved map...');

        }
      }
    };
    function makeMarker(lt, lg) {
      var marker = {
        id: Date.now(),
        coords: {
          latitude: lt,
          longitude: lg
        },
        events: {
          dragend: function (marker) {
            marker.coords = marker.model.coords;
            console.log('Coords:',marker.coords);
          },
          dragstart: function() {
            console.log('dragging now..');
          }
        }
      };
      return marker;
    }
    $scope.markerOptions = {
      draggable: true,
      icon: "/app/images/marker.png"
    };
    // Using geocoding
    $scope.getLocation3 = function() {
      var geocoder = new google.maps.Geocoder();
      var addr = document.getElementById('newAddressPost').value;
      geocoder.geocode({
        "address": addr
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location,
            lat = location.lat(),
            lng = location.lng();
          var marker = makeMarker(lat, lng);
          $scope.map.markers.pop(marker);
          $scope.map.markers.push(marker);
          $scope.$apply();
          console.log($scope.map.markers[0].coords);
        } else {
          console.log("Geocoding not supported");
        }
      });
    };

    $scope.getLatLng = function() {
      var lat = $scope.map.markers[0].coords.latitude;
      var lng = $scope.map.markers[0].coords.longitude;
      if (typeof(Storage) !== "undefined") {
  	    localStorage.setItem("lat",lat);
  			localStorage.setItem("lng", lng);
  		}
  		else {
  		    alert("Sorry, your browser does not support Web Storage...");
  		}
      console.log(lat,lng);
    };
  });


/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('/', {
      url: '/',
      templateUrl: 'app/templates/home.html',
      controller: 'homeCon'
    })
    .state('reports', {
      url: '/reports',
      templateUrl: 'app/templates/reports.html',
      controller: 'reportCon'
    })
    .state('forum', {
      url: '/forum',
      templateUrl: 'app/templates/forum.html',
      controller: 'forumCon'
    })
    .state('graphs', {
      url: '/graphs',
      templateUrl: 'app/templates/graphs.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/templates/login.html'
    })
    .state('makereport', {
      url: '/makereport',
      templateUrl: 'app/templates/makereport.html'
    })
    .state('makereport.1', {
      url: '/1',
      templateUrl: 'app/templates/makereporttemps/makereport1.html',
      controller: 'makereport1Con'
    })
    .state('makereport.2', {
      url: '/2',
      templateUrl: 'app/templates/makereporttemps/makereport2.html',
      controller: 'makereport2Con'
    })
    .state('makereport.3', {
      url: '/3',
      templateUrl: 'app/templates/makereporttemps/makereport3.html',
      controller: 'makereport3Con'
    })
    .state('makereport.4', {
      url: '/4',
      templateUrl: 'app/templates/makereporttemps/makereport4.html',
      controller: 'makereport4Con'
    })
    .state('makepost', {
      url: '/makepost',
      templateUrl: 'app/templates/makepost.html',
      controller: 'makepostCon'
    });
}
