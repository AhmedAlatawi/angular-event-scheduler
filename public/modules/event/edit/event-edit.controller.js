
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventEditController', EventEditController);

  EventEditController.$inject = ['EventService'];

  function EventEditController(eventSvc) {
    var ctrl = this;

    ctrl.text = "TEST";

    // var event = {
    //   name: 'Sample Event',
    //   description: 'This is a sample event for test!',
    //   startTime: new Date(),
    //   endTime: new Date()
    // };

    // eventSvc.create(event);

    console.log('edit-event: ', eventSvc.get());
  }
}(window.angular));