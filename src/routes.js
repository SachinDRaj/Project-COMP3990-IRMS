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
            scope.$eval(attrs.dlEnterKey);
          });
          event.preventDefault();
        }
      });
    };
  })
  .controller('ApplicationController', function ($scope, $window) {
	$scope.currentUser = JSON.parse(localStorage.getItem("user"));
	if($scope.currentUser !== null) console.log($scope.currentUser);
	$scope.setCurrentUser = function (user) {
		localStorage.setItem("user", JSON.stringify(user));
		$window.location.href = '/index.html';
	};
	$scope.getCurrentUser = function() {
		return $scope.currentUser;
	};
	})
  .controller('homeCon', function() {
    console.log('Home controller');
  })
  .controller('LoginController', function($scope) {
	console.log('Login controller');
	$scope.credentials = {
		username: '',
		password: ''
	};
	$scope.login = function(credentials){
		var data = {
			username: credentials.username,
			password: credentials.password
		};
		console.log(data);
		if(data.username === '' || data.password === '')
			console.log("Failed no data");
		else{
			$.ajax({
				url: "http://localhost:8080/api/login",
				data : data,
				type: "POST"
			}).done(function(response){
				console.log("Success! response was "+response);
				if(response.id !== null && response.authentication == 1){
					var user = response;
					console.log(user);
					localStorage.clear();
					$scope.setCurrentUser(user);
					//console.log(JSON.parse(localStorage.getItem("user")));
				}else{
					window.alert("User does not exist");
					console.log("User does not exist");
				}

			}).fail(function(){
				console.log("Request failed");
			});
		}
	};

  })
  .controller('LogoutController', function ($scope, $window) {
	 $scope.logout = function(){
		 localStorage.removeItem("user");
		 $window.location.href = '/index.html';
	 };
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
        status:0,
        window:{
          title :el.title,
          addr:'',
          desc: el.description,
          date: el.date,
        },
        options:  {
          icon: "/app/images/marker.png",
          animation: google.maps.Animation.DROP
        },
        events: {
          click:  function() {
            marker.options.animation = google.maps.Animation.BOUNCE;
            reverseGeocode(marker);
            $scope.postMarker = marker;
            console.log('Marker clicked');
            console.log($scope.postMarker);
          },
          post: function() {
            console.log('Click to make post');
          }
        }
      };
      return marker;
    }
    function populateMap(data){
      $scope.map.markers = [];
      for(var i = 0; i < data.length; i++){
        var m = makeMarker(data[i]);
        $scope.map.markers.push(m);
      }
    }
    $scope.postMarker = {};
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
    // Map and map functions
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
  .controller('makereport3Con', function($scope) {
    console.log('Make a report 3 controller');
  })
  .controller('makereport4Con', function($scope) {
    console.log('Make report4 controller');
    document.getElementById("ca").innerHTML = localStorage.getItem("select");
    document.getElementById("tt").innerHTML = localStorage.getItem("title");
    document.getElementById("de").innerHTML = localStorage.getItem("desc");
    document.getElementById("regSumHeader").innerHTML += localStorage.getItem("region");
    //Map
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
  .controller('makepostCon', function($scope, $window) {
    console.log('Make post controller');
    $scope.postMarker = null;
  	if($scope.getCurrentUser() === null){
  		window.alert("You do not have permission to access this page");
  		$window.location.href = '/index.html';
  	}
    $scope.header = 'Make a Post';

    function getQuery(){ //Makes query
      var cat = document.getElementById('category');
      var county = document.getElementById('county');
      var c = cat.options[cat.selectedIndex].value;
      var cty = county.options[county.selectedIndex].value;
      console.log('Category:',c,'County:',cty);
      var q = '';
      if (c == 'All' && cty == 'All') {
        q = '';
      }else if (cty == 'All'){
        q = "?report_type2=" + c;
      }else if (c == 'All') {
        q="?county=" + cty;
      }else {
        q="?report_type2=" + c + "&county=" + cty;
      }
      console.log(q);
      return q;
    }
    $scope.getReportsQ = function(){ //Updates map for Post area
      var query=getQuery();
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
          $scope.postMarker = 0;
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
    function makeMarker(el) { //Marker maker
      var marker = {
        id: el._id,
        coords: {
          latitude: el.lat,
          longitude: el.lng
        },
        type: el.report_type2,
        county: el.county,
        status:0,
        window:{
          title :el.title,
          addr:'',
          desc: el.description,
          date: el.date,
        },
        options:  {
          icon: "/app/images/marker.png",
          opacity: 1,
          animation: null
        },
        events: {
          click: function() {
            reverseGeocode(marker);
            marker.options.opacity = 1;
            marker.options.animation = google.maps.Animation.BOUNCE;
            localStorage.setItem('lat',marker.coords.latitude);
            localStorage.setItem('lng',marker.coords.longitude);
            $scope.postMarker = 1;
            console.log('Marker click');
            console.log(localStorage.getItem("lat"),localStorage.getItem("lng"));
          }
        }
      };
      return marker;
    }
    function populateMap(data){
      $scope.map.markers = [];
      for(var i = 0; i < data.length; i++){
        var m = makeMarker(data[i]);
        $scope.map.markers.push(m);
      }
    }

    // Map stuff
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
    $scope.windowOptions = {
      visible: false
    };
    $scope.onClick = function() {
      $scope.windowOptions.visible = !$scope.windowOptions.visible;
    };
    $scope.closeClick = function() {
      $scope.windowOptions.visible = false;
      $scope.map.markers.forEach(function(el) {
        el.options.animation = null;
      });
      localStorage.removeItem("lat");
      localStorage.removeItem("lng");
      $scope.postMarker = 0;
    };
    $scope.map = {
      center: {
        latitude: 10.450429,
        longitude: -61.314820
      },
      markers: [],
      zoom: 10
    };
  })
  .controller('graphsCon', function($scope) {
    console.log('Graphs controller');
    $scope.header = 'Graphs';
    // var d = new Date();
    // var n = d.getDate();
    // console.log(n);
    $scope.counties = [ //Counties
      {text:"Caroni", value:"Caroni"},
      {text:"Mayaro", value:"Mayaro"},
      {text:"Nariva", value:"Nariva"},
      {text:"Saint Andrew", value:"Saint Andrew"},
      {text:"Saint David", value:"Saint David"},
      {text:"Saint George", value:"Saint George"},
      {text:"Saint Patrick", value:"Saint Patrick"},
      {text:"Victoria", value:"Victoria"}
    ];
    $scope.categories = [ //Categories
      {text:"Flooding", value:"Flooding"},
      {text:"Road Repairs", value:"Road Repairs"},
      {text:"Garbage Collection", value:"Garbage Collection"}
    ];
    $scope.updateTag3 = function(){
      var c = document.getElementById("Cat3");
      var select = c.options[c.selectedIndex].value;
      $("#gCat3").html("");
      $("#gCat3").append(select);
      $scope.getGReportsQ();
    };
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
    function getQuery1(cat1){
      var c = document.getElementById("region3");
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

    function calculateTimePeriod(cmonth, cyear){
      var arr=[6];
      var arry=[6];
      cmonth++;
      for (var i = 0; i < 6; i++) {
        if (cmonth<1) {
          cmonth=12;
          cyear--;
        }
        arr[i]=cmonth--;
        arry[i]=cyear;
      }
      return [arr,arry];
    }

    $scope.getGReportsQ = function(){ //Updates Column & Map
      console.log("working");
      var period;
      if (document.getElementById("inlineRadio1").checked) {
        period = document.getElementById("inlineRadio1").value;
      }
      else if (document.getElementById("inlineRadio2").checked) {
        period = document.getElementById("inlineRadio2").value;
      }
      else if (document.getElementById("inlineRadio3").checked) {
        period = document.getElementById("inlineRadio3").value;
      }
      var cat1 = document.getElementById("gCat3").innerHTML;
      var query=getQuery1(cat1);
    	var url = "http://localhost:8080/api/get_reports";
      url += query;
    	$.ajax({
        url:url,
        type:"GET"
      }).done(function(data, textStatus, xhr){
        if(data){
          //Load reports-------------------------------------------------------------------------------------------
          // for (var i = 0; i < data.length; i++) {
          //   var day = data[i].date.substr(9,2);
          //   var month = data[i].date.substr(6,2);
          //   var year = data[i].date.substr(2,3);
          //   console.log(day+month+year);
          //
          //   var cdate= new Date();
          //   var cmonth= cdate.getMonth();
          //   var cyear= cdate.getYear();
          //
          //
          //   var gCount=[6];
          //   for (var i = 0; i < 6; i++) {
          //     gCount[i]=0;
          //   }
          //
          //   if (period=="6months"){
          //     var tperiod=calculateTimePeriod(cmonth,cyear);
          //     console.log(tperiod);
          //
          //   for (var i = 0; i < 6; i++) {
          //
          //       if (tperiod[0][i]<10){
          //         var m = tperiod[0][i].toString();
          //         m = '0'+ m;
          //       }else {
          //         var m = tperiod[0][i].toString();
          //       }
          //       tperiod[1][i]=tperiod[1][i]-100;
          //       var n = tperiod[1][i].toString();
          //
          //       if (m==month && n == year) {
          //         gCount[i]++;
          //       }
          //
          //     }
          //   }
          // }
          // console.log(gCount);

          //-------------------------------------------------------------------------------------------------------
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

    var vlSpec = {
      "width": 500,
      "height": 400,
      "data": {
        "values": [
          {"a": 0,"b": 0},
          {"a": 1,"b": 28}, {"a": 2,"b": 55}, {"a": 3,"b": 43},
          {"a": 4,"b": 91}, {"a": 5,"b": 81}, {"a": 6,"b": 53}
        ]
      },
      "mark": "area",
      "encoding": {
        "x": {"field": "a", "type": "quantitative","axis": {"title": "Time Period(months)"}},
        "y": {"field": "b", "type": "quantitative","axis": {"title": "No. of Reports"}}
      }
      };

      var embedSpec = {
        mode: "vega-lite",
        spec: vlSpec
      };
      vg.embed("#vis", embedSpec, function(error, result) {
        $("#vis > div.vega-actions").hide();
      });
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
      templateUrl: 'app/templates/login.html',
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
