
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventCalendarController', EventCalendarController);

  EventCalendarController.$inject = ['EventService', 'uiCalendarConfig', '$filter', '$scope'];

  function EventCalendarController(eventSvc, uiCalendarConfig, $filter, $scope) {
    var ctrl = this;

    /* event source that contains custom events on the scope */
    ctrl.events = [
      // { title: 'All Day Event', start: new Date(y, m, 1) },
      // { title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2) },
      // { id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false },
      // { id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false },
      // { title: 'Birthday Party', start: new Date(y, m, d + 1, 19, 0), end: new Date(y, m, d + 1, 22, 30), allDay: false },
      // { title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    ];

    /* delete event */
    ctrl.delete = function (event) {
      ctrl.isDeleting = true;
      eventSvc.delete(event._id).then(function (res) {
        console.log('event deleted status ', res);
        deleteEvent(event);
      })
        .catch(function () {

        })
        .finally(function () {
          ctrl.isDeleting = false;
          modal('close');
        });
    };

    /* Change View */
    ctrl.renderCalender = function (calendar) {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

    // ctrl.extraEventSignature = function (event) {
    //   return event.start + '' + event.end;
    // };

    /* Render Tooltip */
    function eventRender(event, element, view) {
      var title = '<strong>' + event.title + '</strong>' + '<br/>' +
        '<span>From: </span>' + $filter('date')(new Date(event.start), 'MM/dd/yyyy hh:mm a') + '<br/>' +
        '<span>To: </span>' + $filter('date')(new Date(event.end), 'MM/dd/yyyy hh:mm a');

      $(element).tooltip({ title: title, html: true, container: 'body' });
    }

    ctrl.close = function (form) {
      console.log('close: ', form);
      form.$setPristine();
    };

    /* open modal on eventClick */
    function clickEvent(event, jsEvent, view) {
      var s, e, start, end, updatedEvent;

      ctrl.event = {};
      ctrl.disableSaveButton = false;
      ctrl.disableDeleteButton = false;
      ctrl.showDeleteButton = true;
      ctrl.isSaving = false;

      ctrl.disableStartDate = false;
      ctrl.disableEndDate = false;

      resetForm();

      ctrl.event = event;

      ctrl.color = event.color;
      ctrl.textColor = event.textColor;

      modal('open');

      ctrl.selectedStartDate = $filter('date')(event.start._i, 'MM/dd/yyyy');
      ctrl.selectedEndDate = $filter('date')(event.end._i, 'MM/dd/yyyy');

      ctrl.startTime = event.start._d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      ctrl.endTime = event.end._d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      $scope.$watch(function () {
        return ctrl.selectedStartDate;
      }, function (selectedStartDate) {
        if (selectedStartDate) {
          start = new Date($filter('date')(selectedStartDate, 'yyyy-MM-dd'));
          start.setHours(event.start._d.getHours(), event.start._d.getMinutes(), event.start._d.getSeconds(), event.start._d.getMilliseconds());
        }
      });

      $scope.$watch(function () {
        return ctrl.selectedEndDate;
      }, function (selectedEndDate) {
        if (selectedEndDate) {
          end = new Date($filter('date')(selectedEndDate, 'yyyy-MM-dd'));
          end.setHours(event.end._d.getHours(), event.end._d.getMinutes(), event.end._d.getSeconds(), event.end._d.getMilliseconds());
        }
      });

      $scope.$watch(function () {
        return ctrl.startTime;
      }, function (startTime) {
        if (startTime) {
          if (_.isNumber(startTime)) {
            s = convertMillisecondsToTime(startTime);
            start.setHours(s.hours, s.minutes, s.seconds, s.milliseconds);
          }
        }
      });

      $scope.$watch(function () {
        return ctrl.endTime;
      }, function (endTime) {
        if (endTime) {
          if (_.isNumber(endTime)) {
            e = convertMillisecondsToTime(endTime);
            end.setHours(e.hours, e.minutes, e.seconds, e.milliseconds);
          }
        }
      });

      if (event.source.editable === false) {
        //window.open(event.url);

        ctrl.disableStartDate = true;
        ctrl.disableEndDate = true;

        // TODO: will need fixed
        //ctrl.startTime = event.start._d.toLocaleTimeString();
        //ctrl.endTime = event.end._d.toLocaleTimeString();

        ctrl.disableSaveButton = true;
        ctrl.disableDeleteButton = true;

        return false;
      }

      ctrl.save = function (form) {
        validateDatesAndTimes(start, end, form);

        if (form.$invalid) {
          return;
        }

        ctrl.isSaving = true;

        updatedEvent = {
          title: ctrl.event.title,
          description: ctrl.event.description,
          start: start,
          end: end,
          color: ctrl.color,
          textColor: ctrl.textColor
        };

        eventSvc.update(ctrl.event._id, updatedEvent).then(function (res) {
          ctrl.event = res.data;
          deleteEvent(ctrl.event);
          ctrl.events.push(ctrl.event);
        })
          .catch(function () {

          })
          .finally(function () {
            ctrl.isSaving = false;
            modal('close');
          });
      };

    }

    // open up the selected cell clicked by user in order to add new event
    function addNewEvent(dateEvent, jsEvent, view) {
      var startDate = new Date(dateEvent);
      var endDate = new Date(dateEvent);

      ctrl.disableSaveButton = false;
      ctrl.showDeleteButton = false;
      ctrl.isSaving = false;

      modal('open');

      ctrl.event = {};
      ctrl.event.title = '';
      ctrl.event.description = '';

      ctrl.color = '';
      ctrl.textColor = '';

      $scope.vm.eventForm.submitted = false;

      resetForm();

      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      ctrl.selectedStartDate = $filter('date')(startDate, 'MM/dd/yyyy');
      ctrl.selectedEndDate = $filter('date')(endDate, 'MM/dd/yyyy');

      ctrl.startTime = '';
      ctrl.endTime = '';

      ctrl.startTimeClicked = false;
      ctrl.endTimeClicked = false;

      ctrl.disableStartDate = true;
      ctrl.disableEndDate = false;

      $scope.eventForm.endTime.$setValidity('invalidDateTimeRange', true);
      $scope.eventForm.endTime.$setValidity('invalidDateTimePeriod', true);

      ctrl.save = function (form) {
        var s, e, end;

        s = convertMillisecondsToTime(ctrl.startTime);
        e = convertMillisecondsToTime(ctrl.endTime);

        end = new Date(ctrl.selectedEndDate);

        startDate.setHours(s.hours, s.minutes, s.seconds, s.milliseconds);
        endDate.setHours(e.hours, e.minutes, e.seconds, e.milliseconds);

        end.setHours(e.hours, e.minutes, e.seconds, e.milliseconds);

        validateDatesAndTimes(startDate, end, form);

        if (form.$invalid) {
          return;
        }

        ctrl.event.start = startDate;
        ctrl.event.end = end;

        if (ctrl.color) {
          ctrl.event.color = ctrl.color;
        }

        if (ctrl.textColor) {
          ctrl.event.textColor = ctrl.textColor;
        } else { // default is white
          ctrl.event.textColor = 'white';
        }

        ctrl.isSaving = true;
        ctrl.event.stick = true;

        eventSvc.create(ctrl.event).then(function (res) {
          if (!ctrl.events.length) {
            ctrl.events.push(res.data);
            ctrl.eventSources.push(ctrl.events);
          } else {
            ctrl.events.push(res.data);
          }
        })
          .catch(function () {
            // handle error
          })
          .finally(function () {
            ctrl.isSaving = false;
            modal('close');
          });
      };
    }

    function validateDatesAndTimes(startDate, endDate, form) {
      if (endDate.getTime() < startDate.getTime()) {
        form.endTime.$setValidity('invalidDateTimeRange', false);
      } else {
        form.endTime.$setValidity('invalidDateTimeRange', true);
      }

      if (endDate.getTime() === startDate.getTime()) {
        form.endTime.$setValidity('invalidDateTimePeriod', false);
      } else {
        form.endTime.$setValidity('invalidDateTimePeriod', true);
      }
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

    function modal(action) {
      var modalAction = angular.element(document.querySelector('#modal_' + action + '_id'));

      modalAction && modalAction.click();
    }

    function resetForm() {
      $scope.eventForm.$setUntouched();
      $scope.eventForm.$setPristine();
    }

    function deleteEvent(event) {
      _.forEach(ctrl.events, function (e, i) {
        if (e._id === event._id) {
          ctrl.events.splice(i, 1);
        }
      });
    }

    function convertMillisecondsToTime(timeMilli) {
      var time = {};
      var milliseconds = parseInt((timeMilli % 1000) / 100)
        , seconds = parseInt((timeMilli / 1000) % 60)
        , minutes = parseInt((timeMilli / (1000 * 60)) % 60)
        , hours = parseInt((timeMilli / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? '0' + hours : hours;
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;

      time = {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds
      };

      return time;
    }

    function init() {
      ctrl.eventsLoading = true;
      ctrl.isLoading = true;

      /* event source that pulls from google.com */
      var eventSource = {
        googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
        url: "https://www.googleapis.com/calendar/v3/calendars/usa__en@holiday.calendar.google.com/events?key=AIzaSyAjuKkq7EvbGztcj9eSAnIzqC1iFrpby8U",
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago', // an option!
        color: 'yellow',                    // an option!
        textColor: 'black',                 // an option!
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
          dayClick: addNewEvent,
          eventClick: clickEvent,
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

        })
        .finally(function () {
          ctrl.eventsLoading = false;
        });
    }

    init();
  }

}(window.angular));