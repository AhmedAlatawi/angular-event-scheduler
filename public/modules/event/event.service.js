
(function (angular) {
    'use strict';
  
    angular
      .module('event')
      .service('EventService', EventService);
  
      EventService.$inject = ['$http'];
  
    function EventService($http) {
        this.get = function () {
            return $http.get('/api/events');
        };

        this.create = function (event) {
            return $http.post('/api/events', event);
        };

        this.delete = function (id) {
            return $http.delete('/api/events/' + id);
        };
    }
  }(window.angular));