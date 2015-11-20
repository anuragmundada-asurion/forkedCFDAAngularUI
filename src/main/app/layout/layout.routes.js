(function(){
    "use strict"

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider'];

    //////////////////

    function configureRoutes($stateProvider) {
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "/partials/layout/home.html"
            });
    }
})();