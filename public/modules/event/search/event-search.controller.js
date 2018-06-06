
(function (angular) {
    'use strict';
  
    angular
      .module('event')
      .controller('EventSearchController', EventSearchController);
  
      EventSearchController.$inject = ['EventService'];
  
    function EventSearchController(eventSvc) {
        var ctrl = this;
        ctrl.text = 'TEST';
        
        console.log('search-event: ', eventSvc.get());
    }
  }(window.angular));