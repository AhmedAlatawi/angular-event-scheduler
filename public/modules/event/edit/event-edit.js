
(function (angular) {
    'use strict';

    angular
        .module('event')
        .directive('editEvent', editEvent);

    function editEvent() {
        return {
            restrict: 'E',
            templateUrl: 'modules/event/edit/event-edit.html',
            controller: 'EventEditController',
            controllerAs: 'ctrl',
            scope: {
                event: '=',
                onSelect: '&',
                hideCal: '='
            },
            bindToController: true
        }
    }

}(window.angular));