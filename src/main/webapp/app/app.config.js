(function(){
    "use strict";

    angular.module('app')
        .run(runApp);

    runApp.$inject = ['$rootScope', '$document'];

    ////////////

    function runApp($rootScope, $document) {
        $rootScope.$on('$stateChangeSuccess', function() {
            $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
        });
    }
})();