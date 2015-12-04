(function() {
    "use strict";

    var directiveId = 'uniqueFrom';
    angular
        .module('app')
        .directive(directiveId, uniqueFromDirective);

    uniqueFromDirective.$inject = ['$parse'];

    //////////////////

    function uniqueFromDirective($parse) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: link
        };

        ///////////////////////

        function link(scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            var primaryField = $parse(attrs[directiveId]);

            var validator = function (value) {
                var temp = primaryField(scope),
                    v = value !== temp;
                ctrl.$setValidity(directiveId, v);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            scope.$watch(attrs[directiveId], function () {
                validator(ctrl.$viewValue);
            });

        }
    }
})();