
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventSearchController', EventSearchController);

  EventSearchController.$inject = ['EventService', 'PaginationService', '$scope'];

  function EventSearchController(eventSvc, paginationSvc, $scope) {
    var ctrl = this;

    ctrl.page = {};
    ctrl.setPage = setPage;

    function init() {
      getAllEvents();
    }

    function updateEventStatus(event) {
      event.status = new Date(event.end).getTime() < new Date().getTime() ? 'Expired' : 'Active';
    }

    function getAllEvents() {
      eventSvc.get().then(function (res) {
        ctrl.events = res.data;
        ctrl.pagedEvents = res.data;

        setPage(1); // set to first page as default

        _.forEach(ctrl.events, function (event) {
          updateEventStatus(event);
        });
        _.forEach(ctrl.pagedEvents, function (event) {
          updateEventStatus(event);
        });
      });
    }

    function removeEvent (id, events) {
      _.forEach(events, function (event, i) {
        if (event && event._id === id) {
          events.splice(i, 1);
        }
      });
    }

    function updateEvent (event, e, events) {
      var ev = _.find(events, { _id: event._id });
          ev.title = e.title;
          ev.start = e.start;
          ev.end = e.end;
          updateEventStatus(ev);
    }

    function setPage(page) {
      if (page < 1 || page > ctrl.page.totalPages) {
        return;
      }

      ctrl.page = paginationSvc.getPage(ctrl.pagedEvents.length, page);

      ctrl.events = ctrl.pagedEvents.slice(ctrl.page.startIndex, ctrl.page.endIndex + 1);
    }

    ctrl.selectEvent = function (event) {
      ctrl.onCallBack(event);

      $scope.$watch(function () {
        return ctrl.event;
      }, function (e) {
        if (e && e.updated) {
          updateEvent(event, e, ctrl.events);
          updateEvent(event, e, ctrl.pagedEvents);
        }

        if (e && e.deleted) {
          removeEvent(e._id, ctrl.events);
          removeEvent(e._id, ctrl.pagedEvents);

          setPage(ctrl.page.currentPage || 1);
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


    init();
  }
}(window.angular));