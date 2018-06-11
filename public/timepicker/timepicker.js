

(function (angular) {
    'use strict';
  
    angular
      .module('event-scheduler')
      .directive('timePicker', timePicker);
  
      timePicker.$inject = [];
  
    function timePicker() {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: "timepicker/timepicker.html",
            transclude: true,
            controller: 'TimePickerController',
            controllerAs: 'ctrl',
            scope: {
                selectedTime: '=ngModel',
                selectedDate: '=',
                disableDate: '=',
                clicked: '=',
                minDate: '@?',
                maxDate: '@?'
            },
            bindToController: true
        };
    }
  }(window.angular));