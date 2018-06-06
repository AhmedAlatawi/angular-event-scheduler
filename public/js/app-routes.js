
(function (angular) {
    'use strict';
  
    angular
      .module('event-scheduler')
      .config(routeConfig);
  
      routeConfig.$inject = ['$routeProvider', '$locationProvider'];
  
    function routeConfig($routeProvider, $locationProvider) {
        $routeProvider

        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        .when('/events/editEvents', {
            templateUrl: 'views/edit-events.html',
            controller: 'EventController'
        })

        .when('/events/searchForEvents', {
            templateUrl: 'views/search-events.html',
            controller: 'EventController'
        });

       $locationProvider.html5Mode(true);
    }
  }(window.angular));
