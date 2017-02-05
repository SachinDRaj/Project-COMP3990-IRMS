angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('/', {
      url: '/',
      templateUrl:'app/templates/home.html'
    })
    .state('reports', {
      url: '/reports',
      templateUrl:'app/templates/reports.html'
    })
    .state('forum', {
      url: '/forum',
      templateUrl:'app/templates/forum.html'
    })
    .state('graph', {
      url: '/graph',
      templateUrl:'app/templates/graph.html'
    })
    .state('login', {
      url: '/login',
      template:'<h1>This is the login part.[Modal].</h1>'
    });
}
