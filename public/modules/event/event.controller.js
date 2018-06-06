
(function (angular) {
    'use strict';
  
    angular
      .module('event')
      .controller('EventController', EventController);
  
    EventController.$inject = [];
  
    function EventController() {
      var ctrl = this;
  
      console.log('event controller');
    }
  }(window.angular));