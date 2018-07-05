
(function (angular) {
    'use strict';
  
    angular
      .module('event')
      .controller('EventSearchController', EventSearchController);
  
      EventSearchController.$inject = ['EventService', '$scope'];
  
    function EventSearchController(eventSvc, $scope) {
        var ctrl = this;

        function updateEventStatus(event) {
          event.status = new Date(event.end).getTime() < new Date().getTime() ? 'Expired' : 'Active';
        }

        function getAllEvents () {
          eventSvc.get().then(function (res) {
            ctrl.events = res.data;

            _.forEach(ctrl.events, function(event) {
              updateEventStatus(event);
            });
          });
        }

        ctrl.selectEvent = function (event) {
          ctrl.onCallBack(event);

          $scope.$watch(function () {
            return ctrl.event;
          }, function (e) {
            if (e && e.updated) {
              var ev = _.find(ctrl.events, {_id: event._id});
              ev.title = e.title;
              ev.start = e.start;
              ev.end = e.end;
              updateEventStatus(ev);
            }

            if (e && e.deleted) {
              _.forEach(ctrl.events, function (ev, i) {
                if (ev && ev._id === e._id) {
                  ctrl.events.splice(i, 1);
                }
              });
            }
          }, true);
        };

        ctrl.onSelect = function (callback) {
          ctrl.onCallBack = callback;
        };

        $scope.$watch(function () {
          return ctrl.hideCalendar;
        }, function (hideCalendar) {
          if (!hideCalendar) {
            ctrl.hideCalendar = true;
          }
        });

        getAllEvents();
    }
  }(window.angular));