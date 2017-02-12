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
      zoom: 9
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
    });
}
