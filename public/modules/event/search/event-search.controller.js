
(function (angular) {
    'use strict';
  
    angular
      .module('event')
      .controller('EventSearchController', EventSearchController);
  
      EventSearchController.$inject = ['EventService'];
  
    function EventSearchController(eventSvc) {
        var ctrl = this;
        ctrl.text = 'TEST';
        
        //console.log('search-event: ', eventSvc.get());

        //var events = eventSvc.get();

        eventSvc.get().then(function (res) {
          var ev = res.data[0];

          eventSvc.getById(ev._id).then(function(r) {
            r.data.name = 'Test Event...123';
            console.log('search-event: ', eventSvc.update(r.data._id, r.data));
            console.log('search-event: ', eventSvc.delete(r.data._id));
          });
        });
    }
  }(window.angular));