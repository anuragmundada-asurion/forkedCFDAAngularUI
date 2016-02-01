(function() {
    "use strict";

    angular
        .module('app')
        .directive('input', jdFixInvalidValueFormatting)
        .directive('input', jdFixParsingInconsistencies)
        .directive('input', noAutoCompleteDefault);

    //////////////////

    function jdFixInvalidValueFormatting() {
        return {
            require: '?ngModel',
            restrict: 'E',
            link: link
        };

        function link($scope, $element, $attrs, ngModelController) {
            var inputType = angular.lowercase($attrs.type);

            if (!ngModelController || inputType === 'radio' ||
                inputType === 'checkbox') {
                return;
            }

            ngModelController.$formatters.unshift(function(value) {
                if (ngModelController.$invalid && angular.isUndefined(value)
                    && typeof ngModelController.$modelValue === 'string') {
                    return ngModelController.$modelValue;
                } else {
                    return value;
                }
            });
        }
    }

    function jdFixParsingInconsistencies() {
        return {
            priority: 1,
            require: '?ngModel',
            restrict: 'E',
            link: link
        };

        function link($scope, $element, $attrs, ngModelController) {
            var inputType = angular.lowercase($attrs.type);

            if (!ngModelController || inputType === 'radio' ||
                inputType === 'checkbox') {
                return;
            }

            ngModelController.$parsers.push(fixParser);

            /////////////////

            function fixParser(value) {
                if ((ngModelController.$invalid)) {
                    value = ngModelController.$viewValue;
                    var tempVal;
                    angular.forEach(ngModelController.$parsers, function ($parser) {
                        if ($parser !== fixParser) {
                            tempVal = $parser(value);
                            if(angular.isDefined(tempVal))
                                value = tempVal;
                        }
                    });
                }
                return value;
            }
        }
    }
    function noAutoCompleteDefault() {
        return {
            priority: 1,
            restrict: 'E',
            link: link
        };

        ///////////////////

        function link(scope, element) {
            if(!element.attr('autocomplete'))
                element.attr('autocomplete', 'off');
        }
    }
})();