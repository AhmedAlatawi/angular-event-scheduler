
(function (angular) {
  'use strict';

  angular
    .module('event')
    .controller('EventEditController', EventEditController);

  EventEditController.$inject = ['EventService', '$filter', '$scope'];

  function EventEditController(eventSvc, $filter, $scope) {
    var ctrl = this;

    ctrl.hideCal = false;

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
        if (e && e._id === event._id) {
          ctrl.events.splice(i, 1);
        }
      });
    }

    function convertDateTime(time, d1, d2) {
      if (_.isString(time)) {
        d1 = convertStringTimeToDate(time, d1);
      } else {
        if (_.isNumber(time)) {
          d2 = convertMillisecondsToTime(time);
          d1.setHours(d2.hours, d2.minutes, d2.seconds);
        }
      }
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
      var parts, h, m, p;

      if (!time) return;

      parts = time.match(/(\d+)\:(\d+) (\w+)/);

      h = parts[1];
      m = parts[2];
      p = parts[3];

      if (h === '12' && p === 'AM') {
        h = '00';
      }

      date.setHours(h);
      date.setMinutes(m);

      return date;
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

    function onSelectFn(event) {
      ctrl.clickEvent(event);
    }

    ctrl.onSelect({ callback: onSelectFn });

    ctrl.notify = function (notifyFn) {
      ctrl.notifier = notifyFn;
    };

    // open selected cell clicked by user in order to add new event
    ctrl.addNewEvent = function (dateEvent, jsEvent, view) {
      var startDate = new Date(dateEvent);
      var endDate = new Date(dateEvent);
      var today = new Date();
      var saveFailed = false;

      ctrl.disableSaveButton = false;
      ctrl.showDeleteButton = false;
      ctrl.isSaving = false;

      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (startDate.getTime() < today.getTime()) {
        ctrl.notifier('warning', 'Warning', 'Events can not be added in the past!');

        return;
      }

      modal('open');

      ctrl.event = {};
      ctrl.event.title = '';
      ctrl.event.description = '';

      ctrl.color = '';
      ctrl.textColor = '';

      $scope.vm.eventForm.submitted = false;

      resetForm();

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

        convertDateTime(ctrl.startTime, startDate, s);


        end = new Date(ctrl.selectedEndDate);

        convertDateTime(ctrl.endTime, end, e);

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
            ctrl.notifier('error', 'Error', 'Saving event failed!');
          })
          .finally(function () {
            ctrl.isSaving = false;
            modal('close');
            !saveFailed && ctrl.notifier('success', 'Success', 'Event saved successfully!');
          });
      };
    };

    /* open modal on eventClick */
    ctrl.clickEvent = function (event, jsEvent, view) {
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

      if (event.source && event.source.editable === false) {
        //window.open(event.url);

        ctrl.disableStartDate = true;
        ctrl.disableEndDate = true;

        ctrl.disableSaveButton = true;
        ctrl.disableDeleteButton = true;

        return false;
      }

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
        }
      })
        .catch(function () {
          ctrl.notifier('error', 'Error', 'Failed to retrieve event!');
        })
        .finally(function () {

        });

      ctrl.save = function (form) {
        start = new Date($filter('date')(ctrl.selectedStartDate, 'yyyy-MM-dd'));

        convertDateTime(ctrl.startTime, start, s);

        end = new Date($filter('date')(ctrl.selectedEndDate, 'yyyy-MM-dd'));

        convertDateTime(ctrl.endTime, end, e);

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
          ctrl.events && ctrl.events.push(ctrl.event);
          ctrl.event.updated = true;
        })
          .catch(function () {
            saveFailed = true;
            ctrl.notifier('error', 'Error', 'Saving event failed!');
          })
          .finally(function () {
            ctrl.isSaving = false;
            modal('close');
            !saveFailed && ctrl.notifier('success', 'Success', 'Event saved successfully!');
          });
      };

    };

    /* delete event */
    ctrl.delete = function (event) {
      var deleteFailed = false;
      ctrl.isDeleting = true;
      eventSvc.delete(event._id).then(function (res) {
        console.log('event deleted status ', res);
        deleteEvent(event);
        ctrl.event = event;
        ctrl.event.deleted = true;
      })
        .catch(function () {
          deleteFailed = true;
          ctrl.notifier('error', 'Error', 'Deleting event failed!');
        })
        .finally(function () {
          ctrl.isDeleting = false;
          modal('close');
          !deleteFailed && ctrl.notifier('success', 'Success', 'Event deleted successfully!');
        });
    };

    ctrl.close = function (form) {
      console.log('close: ', form);
      form.$setPristine();
    };

  }
}(window.angular));