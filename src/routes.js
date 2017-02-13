angular
  .module('app')
  .config(routesConfig)
  .controller('homeCon',function(){
    console.log('Home controller');

  })
  .controller('reportCon',function($scope){
    console.log('Report controller');
    $scope.map = {
      center: {
        latitude: 10.450429,
        longitude: -61.314820
      },
      zoom: 9,
      markers: [],
      events: {
        click: function (map, eventName, originalEventArgs) {
            var e = originalEventArgs[0];
            var lat = e.latLng.lat(),lon = e.latLng.lng();
            var marker = {
                id: Date.now(),
                coords: {
                    latitude: lat,
                    longitude: lon
                }
            };
            // $scope.map.markers.pop(marker);
            $scope.map.markers.push(marker);
            console.log($scope.map.markers);
            $scope.$apply();
        }
    }

    }
  })
  .controller('forumCon',function(){
    console.log('Forum contrller');
  });


/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('/', {
      url: '/',
      templateUrl:'app/templates/home.html',
      controller:'homeCon'
    })
    .state('reports', {
      url: '/reports',
      templateUrl:'app/templates/reports.html',
      controller:'reportCon'

    })
    .state('forum', {
      url: '/forum',
      templateUrl:'app/templates/forum.html',
      controller:'forumCon'

    })
    .state('graphs', {
      url: '/graphs',
      templateUrl:'app/templates/graphs.html'
    })
    .state('login', {
      url: '/login',
      templateUrl:'app/templates/login.html'
    })
    .state('makereport', {
      url: '/makereport',
      templateUrl:'app/templates/makereport.html'
    })
    .state('makereport.1', {
      url: '/1',
      templateUrl:'app/templates/makereporttemps/makereport1.html'
    })
    .state('makereport.2', {
      url: '/2',
      templateUrl:'app/templates/makereporttemps/makereport2.html'
    })
    .state('makereport.3', {
      url: '/3',
      templateUrl:'app/templates/makereporttemps/makereport3.html'
    });
}
