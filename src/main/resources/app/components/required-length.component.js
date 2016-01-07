(function() {
    "use strict";

    var directiveId = 'requiredLength';
    angular
        .module('app')
        .directive(directiveId, requiredLength);

    requiredLength.$inject = ['$parse', '$window'];

    //////////////////

    function requiredLength($parse, $window) {
        return {
            require: '?ngModel',
            restrict: 'A',
            priority: 5,
            link: link
        };

        ///////////////////////

        function link(scope, elem, attrs, ctrl) {
            if (!ctrl) return;
            if (!attrs[directiveId]) return;
            var attrVal = attrs[directiveId],
                requiredIfGetter,
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
                if(angular.isDefined(attrVal.requiredIf))
                    requiredIfGetter = $parse(attrVal.requiredIf);
            }
            //var primaryField = $parse(attrs[directiveId]);

            var validator = function (value) {
                var isRequired = requiredIfGetter ? requiredIfGetter(scope) : true,
                    isValid = !isRequired || angular.isDefined(value);
                if(isRequired && angular.isArray(value)) {
                    isValid = (min <= -1 || min <= value.length) && (max <= -1 || max >= value.length);
                }
                ctrl.$setValidity(directiveId, isValid);
                return value;
            };

            if(angular.isDefined(attrVal.requiredIf)) {
                scope.$watch(attrVal.requiredIf, function (isRequired) {
                    validator(ctrl.$viewValue);
                });
            }

            if(elem.attr('type') === 'hidden') {
                scope.$watchCollection(function() {
                    return ctrl.$modelValue;
                }, function() {
                    validator(ctrl.$modelValue);
                })
            }

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            /*scope.$watch(attrs[directiveId], function () {
                validator(ctrl.$viewValue);
            });*/

        }
    }
})();