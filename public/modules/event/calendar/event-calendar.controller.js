
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventCalendarController', EventCalendarController);

  EventCalendarController.$inject = ['EventService', '$filter', '$scope', 'toaster'];

  function EventCalendarController(eventSvc, $filter, $scope, toaster) {
    var ctrl = this;

    /* event source that contains custom events on the scope */
    ctrl.events = [];

    function notify (type, title, msg) {
      toaster.pop(
        {
          type: type,
          title: title,
          body: msg,
          showCloseButton: true
        }
      );
    }

    ctrl.onNotify({notifyFn: notify});

    ctrl.extraEventSignature = function (event) {
      return event.color + '' + event.textColor;
    };

    function addEvent (dateEvent, jsEvent, view) {
      ctrl.onAdd({dateEvent, jsEvent, view});
    }

    function editEvent (event, jsEvent, view) {
      ctrl.onEdit({event, jsEvent, view});
    }

    /* Render Tooltip */
    function eventRender(event, element, view) {
      var title = '<strong>' + event.title + '</strong>' + '<br/>' +
        '<span>From: </span>' + $filter('date')(new Date(event.start), 'MM/dd/yyyy hh:mm a') + '<br/>' +
        '<span>To: </span>' + $filter('date')(new Date(event.end), 'MM/dd/yyyy hh:mm a');

      $(element).tooltip({ title: title, html: true, container: 'body' });
    }

    function loadCalendar(isLoading, view) {
      console.log('calendar is loading: ' + isLoading);
      $scope.$watch(function () {
        return ctrl.eventsLoading;
      }, function (eventsLoading) {
        if (eventsLoading === false) {
          ctrl.isLoading = isLoading;
        }
      });
    }

    function init() {
      ctrl.eventsLoading = true;
      ctrl.isLoading = true;

      /* event source that pulls from google.com */
      var eventSource = {
        googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
        url: 'https://www.googleapis.com/calendar/v3/calendars/usa__en@holiday.calendar.google.com/events?key=AIzaSyAjuKkq7EvbGztcj9eSAnIzqC1iFrpby8U',
        className: 'gcal-event',           
        currentTimezone: 'America/Chicago', 
        color: 'yellow',                    
        textColor: 'black',                 
        borderColor: 'red',
        editable: false
      };

      /* event sources array*/
      ctrl.eventSources = [eventSource];

      /* config object */
      ctrl.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          selectable: true,
          timezone: 'local',
          ignoreTimezone: false,
          header: {
            left: 'title',
            center: '',
            right: 'today prev,next'
          },
          loading: loadCalendar,
          dayClick: addEvent,
          eventClick: editEvent,
          eventRender: eventRender
        }
      };

      eventSvc.get().then(function (res) {
        ctrl.events = res.data;
        if (ctrl.events.length) {
          ctrl.eventSources.push(ctrl.events);
        }
      })
        .catch(function () {
          notify('error', 'Error', 'Failed to retrieve events!');
        })
        .finally(function () {
          ctrl.eventsLoading = false;
        });
    }

    init();
  }

}(window.angular));