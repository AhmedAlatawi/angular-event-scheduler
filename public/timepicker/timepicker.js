

(function (angular) {
    'use strict';
  
    angular
      .module('event-scheduler')
      .directive('dateTimePicker', dateTimePicker);
  
      dateTimePicker.$inject = [];
  
    function dateTimePicker() {
        return {
            restrict: 'E',
            require: 'ngModel',
            templateUrl: 'timepicker/timepicker.html',
            transclude: true,
            controller: 'DateTimePickerController',
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