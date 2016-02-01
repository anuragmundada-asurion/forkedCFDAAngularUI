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

            var primaryField = $parse(attrs[directiveId]),
                hasNgList = angular.isDefined(attrs.ngList),
                ngListValue = hasNgList ? generateRegex(attrs.ngList) : undefined;

            var validator = function (value) {
                var temp = primaryField(scope),
                    valid = true;
                if(angular.isDefined(value)) {
                    valid = !hasNgList
                        ? value !== temp
                        : !$filter('filter')(value.split(ngListValue), temp, true).length;
                }
                ctrl.$setValidity(directiveId, valid);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            scope.$watch(attrs[directiveId], function () {
                validator(ctrl.$viewValue);
            });

            ////////////////

            function generateRegex(value) {
                return value ? new RegExp(value) : /,\s+/;
            }
        }
    }
})();