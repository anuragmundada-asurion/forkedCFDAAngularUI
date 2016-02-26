!function() {
    'use strict';

    angular.module('app').directive('primaryNavBar', function() {
        return {
            restrict: 'E',
            templateUrl: 'main/primary-nav.tpl.html'
        };
    });
}();