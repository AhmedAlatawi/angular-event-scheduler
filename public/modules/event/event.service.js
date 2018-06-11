
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

        this.getById = function (id) {
            return $http.get('/api/events/' + id);
        };

        this.create = function (event) {
            return $http.post('/api/events', event);
        };

        this.update = function (id, event) {
            return $http.put('/api/events/' + id, event);
        };

        this.delete = function (id) {
            return $http.delete('/api/events/' + id);
        };
    }
  }(window.angular));