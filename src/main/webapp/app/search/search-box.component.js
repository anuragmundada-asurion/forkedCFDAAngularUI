!function() {
    'use strict';

    angular.module('app').directive('searchBox', function() {
        return {
            restrict: 'E',
            templateUrl: 'search/search-box.tpl.html',
            link: function(scope, element, attr, controllers){
                $('.ui.dropdown').dropdown();
                $('.ui.accordion').accordion();
                //$(".ui.radio").checkbox();
                $('.ui.circular.label').popup();
            }
        };
    });
}();