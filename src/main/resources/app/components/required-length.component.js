(function() {
    "use strict";

    var directiveId = 'requiredLength';
    angular
        .module('app')
        .directive(directiveId, requiredLength);

    requiredLength.$inject = ['$parse', '$window'];

    //////////////////

    function requiredLength(/*$parse,*/ $window) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: link
        };

        ///////////////////////

        function link(scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs[directiveId]) return;
            var attrVal = attrs[directiveId],
                min = -1,
                max = -1;

            if(!$window.isNaN(attrVal)) {
                min = $window.parseInt(attrVal);
                max = min;
            }
            else {
                attrVal = $window.JSON.parse(attrVal);
                if(angular.isDefined(attrVal.min) && !$window.isNaN(attrVal.min))
                    min = $window.parseInt(attrVal.min);
                /*else
                    scope.$watch(attrVal.min, function() {
                        validator()
                    })*/

                if(angular.isDefined(attrVal.max) && !$window.isNaN(attrVal.max))
                    max = $window.parseInt(attrVal.max);
            }
            //var primaryField = $parse(attrs[directiveId]);

            var validator = function (value) {
                var isValid = angular.isDefined(value);
                if(angular.isArray(value)) {
                    isValid = (min <= -1 || min <= value.length) && (max <= -1 || max >= value.length);
                }
                ctrl.$setValidity(directiveId, isValid);
                return value;
            };

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            /*scope.$watch(attrs[directiveId], function () {
                validator(ctrl.$viewValue);
            });*/

        }
    }
})();