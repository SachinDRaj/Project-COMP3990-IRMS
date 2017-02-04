angular
  .module('app')
  .config(routesConfig);

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/home',
      template:'<h1>Home Page.</h1>'
    })
    .state('report', {
      url: '/report',
      template:'<h1>This is the report area.</h1>'
    })
    .state('forum', {
      url: '/forum',
      template:'<h1>This is the forum.</h1>'
    })
    .state('graph', {
      url: '/graph',
      template:'<h1>This is Graphs.</h1>'
    })
    .state('login', {
      url: '/login',
      template:'<h1>This is the login part.[Modal].</h1>'
    });
}
