
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventCalendarController', EventCalendarController);

  EventCalendarController.$inject = ['EventService', 'uiCalendarConfig', '$compile'];

  function EventCalendarController(eventSvc, uiCalendarConfig, $compile) {
    var ctrl = this;

    console.log('calendar-event: ', eventSvc.get());

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    ctrl.changeTo = 'Hungarian';

    /* event source that pulls from google.com */
    ctrl.eventSource = {
      googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
      url: "https://www.googleapis.com/calendar/v3/calendars/usa__en@holiday.calendar.google.com/events?key=AIzaSyAjuKkq7EvbGztcj9eSAnIzqC1iFrpby8U",
      className: 'gcal-event',           // an option!
      currentTimezone: 'America/Chicago' // an option!
    };

    /* event source that contains custom events on the scope */
    ctrl.events = [
      { title: 'All Day Event', start: new Date(y, m, 1) },
      { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
      { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
      { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
      { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
      { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    ];

    /* event source that calls a function on every view switch */
    ctrl.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{ title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed'] }];
      callback(events);
    };

    ctrl.calEventsExt = {
      color: '#f00',
      textColor: 'yellow',
      events: [
        { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
        { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
        { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
      ]
    };

    /* alert on eventClick */
    ctrl.alertOnEventClick = function (date, jsEvent, view) {
      ctrl.alertMessage = (date.title + ' was clicked ');
    };
    
    /* alert on Drop */
    ctrl.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
      ctrl.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };

    /* alert on Resize */
    ctrl.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
      ctrl.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };

    /* add and removes an event source of choice */
    ctrl.addRemoveEventSource = function (sources, source) {
      var canAdd = 0;
      angular.forEach(sources, function (value, key) {
        if (sources[key] === source) {
          sources.splice(key, 1);
          canAdd = 1;
        }
      });
      if (canAdd === 0) {
        sources.push(source);
      }
    };

    /* add custom event*/
    ctrl.addEvent = function () {
      ctrl.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };

    /* remove event */
    ctrl.remove = function (index) {
      ctrl.events.splice(index, 1);
    };

    /* Change View */
    ctrl.changeView = function (view, calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };

    /* Change View */
    ctrl.renderCalender = function (calendar) {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

    /* Render Tooltip */
    ctrl.eventRender = function (event, element, view) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)(ctrl);
    };

    /* config object */
    ctrl.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: ctrl.alertOnEventClick,
        eventDrop: ctrl.alertOnDrop,
        eventResize: ctrl.alertOnResize,
        eventRender: ctrl.eventRender
      }
    };

    ctrl.changeLang = function () {
      if (ctrl.changeTo === 'Hungarian') {
        ctrl.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        ctrl.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        ctrl.changeTo = 'English';

      } else {
        ctrl.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        ctrl.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        ctrl.changeTo = 'Hungarian';
      }
    };

    /* event sources array*/
    ctrl.eventSources = [ctrl.events, ctrl.eventSource, ctrl.eventsF];
    ctrl.eventSources2 = [ctrl.calEventsExt, ctrl.eventsF, ctrl.events];
  }

}(window.angular));