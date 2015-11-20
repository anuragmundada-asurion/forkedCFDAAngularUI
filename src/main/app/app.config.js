(function(){
    "use strict"

    angular
        .module('app')
        .config(configure);

    configure.$inject = ['$urlRouterProvider'];

    gotoNotFound.$inject = ['$injector', '$location'];

    //////////////////

    function configure($urlRouterProvider) {
        $urlRouterProvider.otherwise(gotoNotFound);
    }

    function gotoNotFound($injector, $location) {
        var state = $injector.get('$state');
        state.go('404');
        return $location.path();
    }
})();