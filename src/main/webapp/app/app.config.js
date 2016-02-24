(function(){
    "use strict";

    angular.module('app').run(
        function ($rootScope, $document) {
            $rootScope.$on('$stateChangeSuccess', function() {
                $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
            });
        }
    );
})();