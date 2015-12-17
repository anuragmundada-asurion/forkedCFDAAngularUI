(function() {
    "use strict";

    angular
        .module('app')
        .directive('triggerClickOnEnter', triggerClickOnEnter);

    //////////////////

    function triggerClickOnEnter() {
        return {
            restrict: 'A',
            link: link,
            scope: false
        };
        /////////////////

        function link(scope, element) {
            element.on('keypress', function(event) {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode === 13) {
                    event.preventDefault();
                    element.click();
                    scope.$apply();
                }
            });
        }
    }
})();