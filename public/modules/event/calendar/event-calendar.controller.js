
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventCalendarController', EventCalendarController);

  EventCalendarController.$inject = ['EventService', 'uiCalendarConfig', '$filter', '$scope', 'toaster'];

  function EventCalendarController(eventSvc, uiCalendarConfig, $filter, $scope, toaster) {
    var ctrl = this;

    /* event source that contains custom events on the scope */
    ctrl.events = [];

    /* delete event */
    ctrl.delete = function (event) {
      var deleteFailed = false;
      ctrl.isDeleting = true;
      eventSvc.delete(event._id).then(function (res) {
        console.log('event deleted status ', res);
        deleteEvent(event);
      })
        .catch(function () {
          deleteFailed = true;
          notifier('error', 'Error', 'Deleting event failed!');
        })
        .finally(function () {
          ctrl.isDeleting = false;
          modal('close');
          !deleteFailed && notifier('success', 'Success', 'Event deleted successfully!');
        });
    };

    /* Change View */
    ctrl.renderCalender = function (calendar) {
      if (uiCalendarConfig.calendars[calendar]) {
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

    ctrl.extraEventSignature = function (event) {
      return event.color + '' + event.textColor;
    };

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
      var saveFailed = false;

      ctrl.event = {};
      ctrl.disableSaveButton = false;
      ctrl.disableDeleteButton = false;
      ctrl.showDeleteButton = true;
      ctrl.isSaving = false;

      ctrl.disableStartDate = false;
      ctrl.disableEndDate = false;

      resetForm();

      eventSvc.getById(event._id).then(function (res) {
        if (res.data) {
          ctrl.event = res.data;

          ctrl.color = ctrl.event.color;
          ctrl.textColor = ctrl.event.textColor;

          modal('open');

          ctrl.selectedStartDate = $filter('date')(ctrl.event.start, 'MM/dd/yyyy');
          ctrl.selectedEndDate = $filter('date')(ctrl.event.end, 'MM/dd/yyyy');

          ctrl.startTime = new Date(ctrl.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          ctrl.endTime = new Date(ctrl.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

        }
      })
        .catch(function () {
          notifier('error', 'Error', 'Failed to retrieve event!');
        })
        .finally(function () {

        });

      ctrl.save = function (form) {
        start = new Date($filter('date')(ctrl.selectedStartDate, 'yyyy-MM-dd'));

        if (_.isString(ctrl.startTime)) {
          start = convertStringTimeToDate(ctrl.startTime, start);
        } else {
          if (_.isNumber(ctrl.startTime)) {
            s = convertMillisecondsToTime(ctrl.startTime);
            start.setHours(s.hours, s.minutes, s.seconds);
          }
        }

        end = new Date($filter('date')(ctrl.selectedEndDate, 'yyyy-MM-dd'));

        if (_.isString(ctrl.endTime)) {
          end = convertStringTimeToDate(ctrl.endTime, end);
        } else {
          if (_.isNumber(ctrl.endTime)) {
            e = convertMillisecondsToTime(ctrl.endTime);
            end.setHours(e.hours, e.minutes, e.seconds);
          }
        }

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
            saveFailed = true;
            notifier('error', 'Error', 'Saving event failed!');
          })
          .finally(function () {
            ctrl.isSaving = false;
            modal('close');
            !saveFailed && notifier('success', 'Success', 'Event saved successfully!');
          });
      };

    }

    // open up the selected cell clicked by user in order to add new event
    function addNewEvent(dateEvent, jsEvent, view) {
      var startDate = new Date(dateEvent);
      var endDate = new Date(dateEvent);
      var saveFailed = false;

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
            saveFailed = true;
            notifier('error', 'Error', 'Saving event failed!');
          })
          .finally(function () {
            ctrl.isSaving = false;
            modal('close');
            !saveFailed && notifier('success', 'Success', 'Event saved successfully!');
          });
      };
    }

    function notifier(type, title, msg) {
      toaster.pop(
        {
          type: type,
          title: title,
          body: msg,
          showCloseButton: true
        }
      );
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
      $scope.eventForm.endTime.$setValidity('invalidDateTimeRange', true);
      $scope.eventForm.endTime.$setValidity('invalidDateTimePeriod', true);
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

    function convertStringTimeToDate(time, date) {
      var parts = time.match(/(\d+)\:(\d+) (\w+)/),
        hours = /am/i.test(parts[3]) ? parseInt(parts[1], 10) : parseInt(parts[1], 10) + 12,
        minutes = parseInt(parts[2], 10);


      date.setHours(hours);
      date.setMinutes(minutes);

      return date;
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
          notifier('error', 'Error', 'Failed to retrieve events!');
        })
        .finally(function () {
          ctrl.eventsLoading = false;
        });
    }

    init();
  }

}(window.angular));