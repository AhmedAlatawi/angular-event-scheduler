
(function (angular) {
    'use strict';

    angular
        .module('event')
        .directive('searchEvent', searchEvent);

    function searchEvent() {
        return {
            restrict: 'E',
            templateUrl: 'modules/event/search/event-search.html',
            controller: 'EventSearchController',
            controllerAs: 'ctrl',
            scope: {
                event: '='
            },
            bindToController: true
        }
    }

}(window.angular));