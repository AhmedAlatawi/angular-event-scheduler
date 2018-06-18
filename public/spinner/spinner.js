
(function (angular) {
    'use strict';

    angular
        .module('event-scheduler')
        .directive('isLoading', isLoading);

    isLoading.$inject = ['$timeout', '$window'];

    function isLoading($timeout, $window) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var elem = element;
                var divElem = angular.element('<div>');
                var spinner = angular.element('<div>');
                var throttler;

                function init() {
                    divElem.addClass('is-loading');

                    if (attr['id']) {
                        divElem.attr('data-target-id', attr['id']);
                    }

                    spinner.addClass('spinner-image');
                    spinner.appendTo(divElem);

                    angular.element('body').append(divElem);

                    divElem.css('zIndex', 500).find('.spinner-image').css('zIndex', 500 + 1);

                    $timeout(setDivElemPosition, 100);
                    $timeout(setDivElemPosition, 200);
                    $timeout(setDivElemPosition, 300);

                    throttler = _.throttle(setDivElemPosition, 50);
                    angular.element($window).scroll(throttler);
                    angular.element($window).resize(throttler);
                }

                function hideShowSpinner(isLoading) {
                    if (isLoading) {
                        show();
                    } else {
                        hide();
                    }
                }

                function setDivElemPosition() {
                    divElem.css({
                        'left': elem.offset().left,
                        'top': elem.offset().top - $(window).scrollTop(),
                        'width': elem.outerWidth(),
                        'height': elem.outerHeight()
                    });
                }

                function show() {
                    divElem.show();
                    setDivElemPosition();
                }

                function hide() {
                    divElem.hide();
                }

                init();

                scope.$watch(attr['isLoading'], function (isLoading) {
                    hideShowSpinner(isLoading);
                });

                scope.$on('$destroy', function cleanup() {
                    divElem.remove();
                    $(window).off('scroll', throttler);
                    $(window).off('resize', throttler);
                });
            }
        };
    }
}(window.angular));