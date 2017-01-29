angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.start', {
    url: '/start',
    views: {
      'side-menu21': {
        templateUrl: 'templates/start.html',
        controller: 'startCtrl'
      }
    }
  })

  .state('menu.login', {
    url: '/login',
    views: {
      'side-menu21': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('menu.savedRoutes', {
    url: '/saved',
    views: {
      'side-menu21': {
        templateUrl: 'templates/savedRoutes.html',
        controller: 'savedRoutesCtrl'
      }
    }
  })

  .state('menu.addNewStop', {
    url: '/addnewstop',
    views: {
      'side-menu21': {
        templateUrl: 'templates/addNewStop.html',
        controller: 'addNewStopCtrl'
      }
    }
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('menu.pickYourStops', {
    url: '/map',
    views: {
      'side-menu21': {
        templateUrl: 'templates/pickYourStops.html',
        controller: 'pickYourStopsCtrl'
      }
    }
  })

  .state('menu.list', {
    url: '/list',
    views: {
      'side-menu21': {
        templateUrl: 'templates/list.html',
        controller: 'listCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/side-menu21/start')

  

});