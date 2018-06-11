
(function (angular) {
    'use strict';

    angular
        .module('event-scheduler')
        .directive('validateFormSubmit', validateFormSubmit);

    validateFormSubmit.$inject = [];

    function validateFormSubmit() {
        return {
            restrict: 'A',
            controller: ['$scope', function ($scope) {
                this.submitted = false;
    
                this.setSubmitted = function() {
                    this.submitted = true;
                };
            }], 
            compile: function(cEle, cAttrs, ctrans) {
                return {
                    pre: function(scope, form, attrs, ctrl) {
                        scope.vm = scope.vm || {};
                        scope.vm[attrs.name] = ctrl;
                    },
                    post: function(scope, form, attrs, ctrl) {
                        form.bind('submit', function (event) {
                            ctrl.setSubmitted();
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                    }
                };
            }
        }; 
    }
}(window.angular));