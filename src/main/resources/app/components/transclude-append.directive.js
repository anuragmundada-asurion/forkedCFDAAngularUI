(function() {
    "use strict";

    angular
        .module('app')
        .directive('transcludeAppend', transcludeAppendDirective);

    /////////////////

    function transcludeAppendDirective() {
        return {
            link: link
        };

        function link(scope, element, attrs, ctrl, transclude) {
            transclude(scope, function(clone) {
                element.append(clone);
            });
        }
    }

})();