(function() {
    "use strict";

    var directiveId = 'uniqueFrom';
    angular
        .module('app')
        .directive(directiveId, uniqueFromDirective);

    uniqueFromDirective.$inject = ['$parse', '$filter'];

    //////////////////

    function uniqueFromDirective($parse, $filter) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: link
        };

        ///////////////////////

        function link(scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            var primaryField = $parse(attrs[directiveId]),
                hasNgList = angular.isDefined(attrs.ngList),
                ngListValue = hasNgList ? generateRegex(attrs.ngList) : undefined;

            var validator = function (value) {
                var temp = primaryField(scope),
                    v = !hasNgList || !value
                        ? value !== temp
                        : !$filter('filter')(value.split(ngListValue), temp, true).length;
                ctrl.$setValidity(directiveId, v);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            scope.$watch(attrs[directiveId], function () {
                validator(ctrl.$viewValue);
            });

            ////////////////

            function generateRegex(value) {
                return value ? new RegExp(value) : /[, ]+/;
            }
        }
    }
})();