(function() {
    "use strict";

    angular
        .module('app')
        .directive('uiSelect', uiSelectDirective);

    uiSelectDirective.$inject = ['$window'];

    //////////////////

    function uiSelectDirective($window) {
        return {
            restrict: 'EA',
            require: 'uiSelect',
            link: link
        };
        /////////////////

        function link(scope, element, attrs, ctrl) {
            scope.$select.limit = (angular.isDefined(attrs.limit)) ? $window.parseInt(attrs.limit, 10) : undefined;
            var superSelect = ctrl.select;
            ctrl.select = function() {
                if(!ctrl.multiple || ctrl.limit === undefined || ctrl.selected.length < ctrl.limit)
                    superSelect.apply(ctrl, arguments);
            };
        }
    }
})();