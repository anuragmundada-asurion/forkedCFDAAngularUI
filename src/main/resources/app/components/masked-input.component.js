(function() {
    "use strict";

    angular
        .module('app')
        .directive('maskedInput', maskedInputDirective);

    maskedInputDirective.$inject = ['$timeout'];

    //////////////////

    function maskedInputDirective($timeout) {
        return {
            require: 'ngModel',
            restrict: 'E',
            priority: 1,
            scope: {
                mask: "@"
            },
            link: link
        };

        ///////////////////

        function link(scope, element, attrs, ctrl) {
            var parts = scope.mask.split('-'),
                inputElements = [];
            angular.forEach(parts, function(part, index){
                var input = createInput(part),
                    isEnd = index >= parts.length - 1;
                input.$part = part;
                element.append(input);
                inputElements.push(input);
                input.bind('keydown keypress', function(){
                    $timeout(function() {
                        var value = input.val();
                        if(value) {
                            value = value.replace(/[^0-9]/g, '');
                            input.val(value.substring(0, part.length));
                            var valCharLength = value.length;
                            if(valCharLength >= part.length && !isEnd)
                                inputElements[index + 1].focus().select();
                        }
                        else if(index > 0)
                            inputElements[index - 1].focus();
                        updateModel();
                    }, 0);
                });
                if(!isEnd)
                    element.append("<span>-</span>")
            });
            scope.$watch(function () {
                return ctrl.$modelValue;
            }, function(newValue) {
                translateValue(newValue);
            });
            ////////////

            function translateValue(value) {
                if(value) {
                    var valueParts = value.split('-');
                    for(var i = 0; i < valueParts.length; i++) {
                        var input = inputElements[i],
                            maskPart = input.$part,
                            mVal = valueParts[i].replace(/_/g,"");
                        input.val(mVal.substring(0, maskPart.length));

                    }
                }
                updateModel(false);
            }

            function updateModel(isDirty) {
                if(!angular.isDefined(isDirty))
                    isDirty = true;
                var value = "",
                    isEmpty = true;
                angular.forEach(inputElements, function(input, index){
                    var part = input.$part,
                        partLength = part.length,
                        inputVal = input.val();
                    if(inputVal.length > 0)
                        isEmpty = false;
                    while(inputVal.length < partLength)
                        inputVal += '_';
                    value += inputVal;
                    if(index < inputElements.length - 1)
                        value += '-';
                });
                if(isEmpty)
                    value = null;
                ctrl.$dirty = isDirty;
                ctrl.$setViewValue(value);
                apply(value);
            }
            function apply(value) {
                var isValid = value && value.indexOf('_') < 0;
                ctrl.$setValidity('filled', isValid);
                ctrl.$render();
            }
            function createInput(part) {
                var classes = "masked-input-length-" + part.length;
                return angular.element("<input type='text' class='" + classes + "'>");
            }
        }
    }
})();