!function() {
    'use strict';

    angular.module('app').directive('globalSearchBox', function() {
        return {
            restrict: 'E',
            templateUrl: 'search/global-search.tpl.html'
        };
    });
}();