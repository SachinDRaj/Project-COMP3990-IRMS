angular
  .module('app')
  .config(routesConfig)
  .directive('dlEnterKey', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        var keyCode = event.which || event.keyCode;
        // If enter key is pressed
        if (keyCode === 13) {
          scope.$apply(function() {
                  // Evaluate the expression
              scope.$eval(attrs.dlEnterKey);
          });
          event.preventDefault();
        }
      });
    };
  })
  .controller('homeCon', function() {
    console.log('Home controller');
  })
  .controller('reportCon', function($scope,$http) {
    console.log('Report controller');
    $scope.header = 'View Reports';
    $scope.counties = [ //Counties
      {text:"Counties - All", value:"All"},
      {text:"Caroni", value:"Caroni"},
      {text:"Mayaro", value:"Mayaro"},
      {text:"Nariva", value:"Nariva"},
      {text:"Saint Andrew", value:"Saint Andrew"},
      {text:"Saint David", value:"Saint David"},
      {text:"Saint George", value:"Saint George"},
      {text:"Saint Patrick", value:"Saint Patrick"},
      {text:"Victoria", value:"Victoria"}
    ];
    //Reports & markers data initial
    $http.get('http://localhost:8080/api/get_reports').then(
      function(success) {
        $scope.reports = []; //Reports
        $scope.reports = success.data;
        var data = success.data;  //Map markers
        console.log('Data: ',data);
        populateMap(data);
        console.log('Markers: ',$scope.map.markers);
      },
      function(data, status, headers, config) {
        // log error
      }
    );
    function properF1(cat1){
      if (cat1=="All Categories") {
        return "All";
      }else if (cat1=="Flooding") {
        return "flooding";
      }else if (cat1=="Road Repairs") {
        return "road_repair";
      }else if (cat1=="Garbage Collection") {
        return "garbage_collection";
      }
    }
    $scope.updateTag1 = function(cat1){
      $("#Cat2").html("");
      $("#Cat2").append(cat1);
      $scope.getReportsQ();
    };
    function getQuery1(cat1){
      var c = document.getElementById("region1");
      var select = c.options[c.selectedIndex].value;
      var q="";
      cat1 = properF1(cat1);
      if (select=="All" && cat1=="All") {
        q="";
      }else if (select=="All"){
        q="?report_type2="+cat1;
      }else if (cat1=="All") {
        q="?county="+select;
      }else {
        q="?report_type2="+cat1+"&county="+select;
      }
      return q;
    }

    $scope.getReportsQ = function(){ //Updates Column & Map
      var cat1 = document.getElementById("Cat2").innerHTML;
      var query=getQuery1(cat1);
    	var url = "http://localhost:8080/api/get_reports";
      url += query;
    	$.ajax({
        url:url,
        type:"GET"
      }).done(function(data, textStatus, xhr){
        $scope.reports = [];
        if(data){
          //Load reports
          $scope.reports = data;
          //Populating Map
          populateMap(data);
          $scope.$apply();
        }
        else{
            //if(callback) callback(null);
        }
      }).fail(function(xhr){
        var status = xhr.status;
        var message = null;
        if(xhr.responseText){
            var obj = JSON.parse(xhr.responseText);
            message = obj.message;
        }

        if(callback) callback(null);
        console.log(xhr);
      });
    };
    //Map and map functions
    function reverseGeocode(m) {
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(m.coords.latitude, m.coords.longitude);

      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            m.window.addr = results[0].formatted_address;
            console.log(results[0].formatted_address);
            $scope.$apply();
          } else {
            console.log('No results found');
          }
        }
        else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          console.log('Geocoder failed due to: ' + status + m.window.title);
        }
      });
    }
    function makeMarker(el) { //Marker maker
      var marker = {
        id: el._id,
        coords: {
          latitude: el.lat,
          longitude: el.lng
        },
        window:{
          title :el.title,
          addr:'',
          desc: el.description,
          date: el.date,
        }
      };
      reverseGeocode(marker);
      return marker;
    }
    function populateMap(data){
      $scope.map.markers = [];
      for(var i = 0; i < data.length; i++){
        var m = makeMarker(data[i],i);
        $scope.map.markers.push(m);
      }
    }
    $scope.markerOptions = {
      icon: "/app/images/marker.png",
      // animation: google.maps.Animation.DROP
    };
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
        }
      },
      zoom: 9,
      pan: true,
      markers: [],
      options:{
        scrollwheel: false
      }
    };
    $scope.windowOptions = {
      visible: false
    };
    $scope.onClick = function() {
      $scope.windowOptions.visible = !$scope.windowOptions.visible;
    };
    $scope.closeClick = function() {
      $scope.windowOptions.visible = false;
    };
    //Update dropdown text
    $(".dropdown-menu li a").click(function(){
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
    });
  })
  .controller('makereportCon', function($scope){//Base
    $scope.header = 'Make a Report';
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
      var c = document.getElementById("select2");
  		var region = c.options[c.selectedIndex].value;
      var addr = document.getElementById('newAddress').value +' '+region+' Trinidad';

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
  .controller('forumCon', function($scope) {
    console.log('Forum controller');
    $scope.header = 'Forum';
	  getPost();
    //Update dropdown textStatus
    $(".dropdown-menu li a").click(function(){
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
    });

  })
  .controller('makepostCon', function($scope) {
    console.log('Make post controller');
    $scope.header = 'Make a Post';

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
          $scope.getLatLng();//Local storage for latlng
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
    // Map stuff
    $scope.rectangle =  {
      fill: {
        color: '#08B21F',
        opacity: 0.5
      },
      stroke: {
        color: '#08B21F',
        weight: 2,
        opacity: 1
      },
      bounds:{
        ne: {
          latitude: 10.5,
          longitude: -61.168250
        },
        sw: {
          latitude: 10.3,
          longitude: -61.366004
        }
      },
      draggable: true,
      editable:true,
      events:{
        bounds_changed : function() {
          console.log('Bounds changed',$scope.rectangle.bounds);
        },
        click : function(){
          console.log('Bounds changed',$scope.rectangle.bounds);
        }
      }
    };
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
  })
  .controller('graphsCon', function($scope) {
    console.log('Graphs controller');
    $scope.header = 'Graphs';
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
      templateUrl: 'app/templates/graphs.html',
      controller: 'graphsCon'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/templates/login.html'
    })
    .state('makereport', {
      url: '/makereport',
      templateUrl: 'app/templates/makereport.html',
      controller: 'makereportCon'
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
