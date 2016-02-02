!function() {
    'use strict';

    angular.module('app').directive('globalSearchBox', function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/search/global-search.tpl.html'
        };
    });
}();