
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventEditController', EventEditController);

  EventEditController.$inject = ['EventService'];

  function EventEditController(eventSvc) {
    var ctrl = this;

    ctrl.text = "TEST";
    
    console.log('edit-event: ', eventSvc.get());
  }
}(window.angular));