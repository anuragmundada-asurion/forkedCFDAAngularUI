(function() {
    "use strict";

    angular
        .module('app')
        .directive('triggerClickOnEnter', triggerClickOnEnter);

    //////////////////

    function triggerClickOnEnter() {
        var activeClass = 'active';

        return {
            restrict: 'A',
            link: link,
            scope: false
        };
        /////////////////

        function link(scope, element) {
            var isActive = false;
            element.on('keyup', function(event) {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode === 13 && isActive) {
                    event.preventDefault();
                    element.click();
                    scope.$apply();
                    removeActiveState();
                }
            });
            element.on('keydown', function(event) {
                var keyCode = (event.keyCode ? event.keyCode : event.which);
                if (keyCode === 13) {
                    event.preventDefault();
                    addActiveState();
                }
            });
            element.on('blur', function(){
                removeActiveState();
            });

            ////////////

            function addActiveState() {
                isActive = true;
                element.addClass(activeClass);
            }

            function removeActiveState() {
                isActive = false;
                element.removeClass(activeClass);
            }
        }
    }
})();