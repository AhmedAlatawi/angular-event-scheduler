
(function (angular) {
    'use strict';

    angular
        .module('event')
        .directive('eventCalendar', eventCalendar);

    function eventCalendar() {
        return {
            restrict: 'E',
            templateUrl: 'modules/event/calendar/event-calendar.html',
            controller: 'EventCalendarController',
            controllerAs: 'ctrl',
            scope: {
                event: '='
            },
            bindToController: true
        };
    }

}(window.angular));