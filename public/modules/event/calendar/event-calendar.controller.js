
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventCalendarController', EventCalendarController);

  EventCalendarController.$inject = ['EventService', 'uiCalendarConfig', '$filter', '$scope'];

  function EventCalendarController(eventSvc, uiCalendarConfig, $filter, $scope) {
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
      // { title: 'All Day Event', start: new Date(y, m, 1) },
      // { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
      // { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
      // { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
      // { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
      // { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
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
    ctrl.alertOnEventClick = function (event, jsEvent, view) {
      ctrl.alertMessage = (event.title + ' was clicked ');
      alert('Clicked on: ', event);

      if (event.url) {
        //window.open(event.url);
        return false;
      }
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
    ctrl.changeView = function (view) {
      uiCalendarConfig.calendars.calendar.fullCalendar('changeView', view);
    };

    /* Change View */
    ctrl.renderCalender = function (calendar) {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

    /* Render Tooltip */
    ctrl.eventRender = function (event, element, view) {
      var title = '<strong>' + event.title + '</strong>' + '<br/>' +
        '<span>From: </span>' + $filter('date')(new Date(event.start), "EEE, MMM d, yyyy 'at' hh:mm a") + '<br/>' +
        '<span>To: </span>' + $filter('date')(new Date(event.end), "EEE, MMM d, yyyy 'at' hh:mm a");

      $(element).tooltip({ title: title, html: true, container: 'body' });
    };

    // this function is called when calendar is loading or finished loading
    ctrl.loading = function (isLoading, view) {
      console.log('calendar is loading: ' + isLoading);
    };

    // open up the selected cell clicked by user in order to add new event
    ctrl.goToRootScopeDate = function (dateEvent, jsEvent, view) {
      var startDate = new Date(dateEvent);
      var endDate = new Date(dateEvent);
      var today = new Date();

      // var openBtn = angular.element(document.querySelector('#modal_open_id'));
      // var closeBtn = angular.element(document.querySelector('#modal_close_id'));

      modal('open');

      ctrl.event = {};
      ctrl.event.title = '';
      ctrl.event.description = '';

      $scope.vm.eventForm.submitted = false;

      $scope.eventForm.$setPristine();

      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      ctrl.selectedStartDate = $filter('date')(startDate, 'MM/dd/yyyy');
      ctrl.selectedEndDate = $filter('date')(endDate, 'MM/dd/yyyy');

      ctrl.startTime = '';
      ctrl.endTime = '';

      ctrl.startTimeClicked = false;
      ctrl.endTimeClicked = false;

      ctrl.disableStartDate = true;
      ctrl.disableEndDate = false;

      // ctrl.eventForm.$setPristine();
      // ctrl.eventForm.name.$invalid = false;
      //ctrl.eventForm.$valid = true;

      // $scope.$watch('eventForm.endTime', function (newValue, oldValue) {
      //   if (newValue && newValue.$valid) {
      //     console.log('end time new value: ', newValue.$valid);
      //     $scope.eventForm.endTime.$setValidity('invalidDateTimeRange', true);
      //   }
      // });

      ctrl.save = function (form) {
        var s, e, end;

        s = convertMillisecondsToTime(ctrl.startTime);
        e = convertMillisecondsToTime(ctrl.endTime);

        end = new Date(ctrl.selectedEndDate);

        startDate.setHours(s.hours, s.minutes, s.seconds, s.milliseconds);
        endDate.setHours(e.hours, e.minutes, e.seconds, e.milliseconds);

        end.setHours(e.hours, e.minutes, e.seconds, e.milliseconds);

        if (end.getTime() < startDate.getTime()) {
          form.endTime.$setValidity('invalidDateTimeRange', false);
        } else {
          form.endTime.$setValidity('invalidDateTimeRange', true);
        }

        if (form.$invalid) {
          return;
        }

        ctrl.event.start = startDate;
        ctrl.event.end = end;

        ctrl.event.color = '#f00';
        ctrl.event.textColor = 'yellow';

        ctrl.events.push(ctrl.event);

        console.log('startTime: ', startDate);
        console.log('endTime: ', endDate);

        console.log('selectedEndDate: ', end);

        modal('close');

      };

      ctrl.close = function (form) {
        console.log('close: ', form);
        form.$setPristine();
      };

      // if (startDate.getTime() >= today.getTime()) {
      // 	var s = new Date(dateEvent);
      // 	var e = new Date(dateEvent);

      // 	if (view.name === 'month') {
      // 		s.setDate(s.getDate() + 1);
      // 		e.setDate(e.getDate() + 2);
      // 	}

      // 	e.setHours(e.getHours() + 1);

      // 	var event = {
      // 			status: 'NEW',
      // 			sameDay: false,
      // 			start:  new Date(s),
      // 			end: new Date(e),
      // 			outdoor: false,
      // 			building: 'main_building',
      // 			room: 'lobby',
      // 			postedBy: $scope.vm.userName,
      // 			postedFirstName: $scope.vm.firstName,
      // 			postedLastName: $scope.vm.lastName
      // 	};

      // 	modalFactory.open('lg', 'calendarEvent.html', 'CalendarCtrl', event);

      // } else {
      // 	$scope.alert = {type: 'x-warning', flag: 'wrongDate', msg: " Selected date must not be before today's date!"};
      // 	modalFactory.open('md', 'alert.html', 'AlertCtrl', $scope.alert);
      // }
    };

    /* config object */
    ctrl.uiConfig = {
      calendar: {
        height: 450,
        editable: true,
        selectable: true,
        timezone: "local",
        ignoreTimezone: false,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        loading: ctrl.loading,
        dayClick: ctrl.goToRootScopeDate,
        eventClick: ctrl.alertOnEventClick,
        eventDrop: ctrl.alertOnDrop,
        eventResize: ctrl.alertOnResize,
        //defaultView: 'month',
        //eventMouseover: $scope.eventMouseover,
        //eventMouseout: $scope.eventMouseout,
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

    function modal(action) {
      var modalAction = angular.element(document.querySelector('#modal_' + action + '_id'));

      modalAction && modalAction.click();
    }

    function convertMillisecondsToTime(timeMilli) {
      var time = {};
      var milliseconds = parseInt((timeMilli % 1000) / 100)
        , seconds = parseInt((timeMilli / 1000) % 60)
        , minutes = parseInt((timeMilli / (1000 * 60)) % 60)
        , hours = parseInt((timeMilli / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      time = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds
      };

      return time;
    }
  }

}(window.angular));