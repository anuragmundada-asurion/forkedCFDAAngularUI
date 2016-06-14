!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('errorMsg', [ function () {
        return {
            restrict: "AE",
            replace: true,
            scope: {
                "model": "=",
                "regexPattern": "@",
                "msg": "@"
            },
            link: function (scope, element, attributes) {
                //build regex object
                var regexObj = new RegExp(scope.regexPattern, 'g');
                //watch model for changes
                scope.$watch("model", function (newValue, oldValue) {
                    //regular expression obj is stateful, must reset lastIndex each time
                    regexObj.lastIndex = 0;
                    if (newValue) {
                        if(!regexObj.test(newValue)){
                            scope.showErrorMsg = true;
                            element.closest(".input-field").addClass("usa-input-error");
                        }else{
                            scope.showErrorMsg = false;
                            element.closest(".input-field").removeClass("usa-input-error");
                        }
                    }
                });


            },
            template: '<span class="usa-input-error-message" ng-show="showErrorMsg" >{{msg}}</span>'
        };


    }]);
}();
