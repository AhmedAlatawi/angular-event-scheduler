

(function (angular) {
    'use strict';

    angular
        .module('event-scheduler')
        .controller('DateTimePickerController', DateTimePickerController);

    DateTimePickerController.$inject = ['$scope', '$document', '$element'];

    function DateTimePickerController($scope, $document, $element) {
        var ctrl = this;

        ctrl.clicked = false;
        ctrl.disableDate = false;

        var periods = {
            AM: [],
            PM: []
        };

        // prevent user from keyboard editing on the input box elements
        $element.on('keydown keyup', function (event) {
            event.preventDefault();
        });

        // needed to prevent any parent handlers from being notified 
        // of the event e.g. eventModal element handler
        $document.on('click', '#timepicker_id', function (event) {
            event.stopPropagation();
        });

        // needed to handle any clicks outside the timepicker element to close it if a click occurs
        $document.on('click', '#eventModal_id', function (event) {
            event.stopPropagation();

            if (ctrl.clicked) {
                ctrl.clicked = false;
                $scope.$apply();
            }
        });

        function updateTimeString(hours, minutes, timeString) {
            var parts = timeString.match(/(\d+)\:(\d+) (\w+)/),
                h = parts && parts[1],
                m = parts && parts[2],
                p = parts && parts[3];

            h = hours ? hours : h;
            m = minutes ? minutes : m;

            if (h === '00' || !h) {
                h = '12';
            }

            if (!p) {
                p = 'AM';
            }

            return h + ':' + m + ' ' + p;
        }

        for (var i = 0; i <= 11; i++) {
            periods.AM.push({
                label: (i < 10 ? '0' + i : i),
                value: i
            });
        }

        periods.PM.push({
            label: 12,
            value: 12
        });

        for (var i = 1; i <= 11; i++) {
            periods.PM.push({
                label: (i < 10 ? '0' + i : i),
                value: i + 12
            });
        }

        ctrl.periods = ["AM", "PM"];
        ctrl.hours = periods.AM;
        ctrl.minutes = ["00", "15", "30", "45"];

        if (_.isUndefined(ctrl.selectedTime)) {
            ctrl.selectedTime = 9 * 60 * 60 * 1000;
        }

        ctrl.toggle = function () {
            ctrl.clicked = !ctrl.clicked;
        };

        $scope.$watch(function () {
            return ctrl.selectedTime;
        }, function (selectedTime) {
            ctrl.updateTimeString(selectedTime);
        });

        ctrl.selectPeriod = function (period) {
            ctrl.hours = periods[period];
            ctrl.selectedTime = (period == "AM" ? (9 * 60 * 60 * 1000) : (15 * 60 * 60 * 1000));
        };

        ctrl.selectHour = function (hour) {
            ctrl.selectedTime = (hour.value * 60 * 60 * 1000);
        };

        ctrl.selectMinute = function (minute) {
            var time = ctrl.selectedTime;
            var mts = time % (60 * 60 * 1000);
            ctrl.selectedTime = _.isString(time) ? updateTimeString(null, minute, ctrl.selectedTime) : (time - mts + minute * 60 * 1000);
            ctrl.toggle();
        };

        ctrl.updateTimeString = function (selectedTime) {
            var mts = selectedTime % (60 * 60 * 1000);
            var hrs = (selectedTime - mts) / (60 * 60 * 1000);
            var mts2 = mts / (60 * 1000);
            var mer = (hrs < 11) ? "AM" : "PM";
            var hrs2 = (hrs > 12) ? hrs - 12 : hrs;

            if (selectedTime && _.isString(selectedTime)) {
                ctrl.timeString = selectedTime;
            } else {
                ctrl.timeString = (hrs2 < 10 ? '0' + hrs2 : hrs2) + ":" + (mts2 == 0 ? '00' : mts2) + " " + mer;
                ctrl.timeString = updateTimeString(null, null, ctrl.timeString);
            }
        };
    }
}(window.angular));