(function (angular) {
    'use strict';

    angular
        .module('event-scheduler')
        .service('PaginationService', PaginationService);

    PaginationService.$inject = [];

    function PaginationService() {

        this.getPage = function (totalItems, currentPage, pageSize) {
            var pages,
                totalPages,
                startPage,
                endPage,
                startIndex,
                endIndex;

            currentPage = currentPage || 1;

            pageSize = pageSize || 5;

            totalPages = Math.ceil(totalItems / pageSize);

            if (totalPages <= 10) {
                startPage = 1;
                endPage = totalPages;
            } else {
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            startIndex = (currentPage - 1) * pageSize;
            endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            pages = _.range(startPage, endPage + 1);

            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        };
    }
}(window.angular));