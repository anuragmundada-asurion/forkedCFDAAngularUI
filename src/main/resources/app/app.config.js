(function(){
    "use strict"

    angular
        .module('app')
        .config(configure)
        .run(runApp);

    configure.$inject = ['$urlRouterProvider'];

    gotoNotFound.$inject = ['$injector', '$location'];

    runApp.$inject = ['$rootScope', '$document'];

    //////////////////

    function configure($urlRouterProvider) {
        $urlRouterProvider.otherwise(gotoNotFound);
    }

    function gotoNotFound($injector, $location) {
        var state = $injector.get('$state');
        state.go('404');
        return $location.path();
    }
    function runApp($rootScope, $document) {
        $rootScope.$on('$stateChangeSuccess', function() {
            $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
        });
    }
})();