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

            var attrVal = $parse(attrs[directiveId])(scope),
                requiredIfGetter,
                validatorConfig = {
                    min: -1,
                    max: -1
                };

            if(angular.isNumber(attrVal))
                validatorConfig.min = attrVal;
            else if(angular.isObject(attrVal))
                angular.extend(validatorConfig, attrVal);
            else
                return;

            if(angular.isDefined(validatorConfig.requiredIf))
                requiredIfGetter = $parse(validatorConfig.requiredIf);

            var validator = function (value) {
                var isRequired = requiredIfGetter ? requiredIfGetter(scope) : true,
                    isValid = !isRequired || angular.isDefined(value);
                if(isRequired && angular.isArray(value)) {
                    isValid = (validatorConfig.min <= -1 || validatorConfig.min <= value.length)
                        && (validatorConfig.max <= -1 || validatorConfig.max >= value.length);
                }
                ctrl.$setValidity(directiveId, isValid);
                return value;
            };

            if(angular.isDefined(validatorConfig.requiredIf)) {
                scope.$watch(validatorConfig.requiredIf, function () {
                    validator(ctrl.$viewValue);
                });
            }

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);

        }
    }
})();