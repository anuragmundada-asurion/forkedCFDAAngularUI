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
                var regexObj = new RegExp(scope.regexPattern); //only need to resetIndex to 0 if flag "g" is specified
                //watch model for changes
                scope.$watch("model", function (newValue, oldValue) {
                    if (newValue) {
                        if(scope.regexPattern == "website_url"){
                            //use literal for website url regex
                            if(!(/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(newValue))){
                                scope.showErrorMsg = true;
                                element.closest(".input-field").addClass("usa-input-error");
                            }else{
                                scope.showErrorMsg = false;
                                element.closest(".input-field").removeClass("usa-input-error");
                            }
                        }else{
                            if(!regexObj.test(newValue)){
                                scope.showErrorMsg = true;
                                element.closest(".input-field").addClass("usa-input-error");
                            }else{
                                scope.showErrorMsg = false;
                                element.closest(".input-field").removeClass("usa-input-error");
                            }
                        }

                    }
                });


            },
            template: '<span class="usa-input-error-message" ng-show="showErrorMsg" >{{msg}}</span>'
        };


    }]);
}();
