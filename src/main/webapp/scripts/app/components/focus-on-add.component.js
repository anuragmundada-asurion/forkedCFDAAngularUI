(function() {
    "use strict";

    angular
        .module('app')
        .directive('focusOnAdd', focusOnAdd);

    //////////////////

    function focusOnAdd() {
        return {
            restrict: "A",
            scope: {
                trigger: '=focusOnAdd'
            },
            link: link
        };

        /////////////////

        function link(scope, element) {
            var unbind = scope.$watch('trigger', function (value) {
                if (value === true) {
                    element.focus();
                    scope.trigger = false;
                    unbind();
                }
            });
        }
    }
})();