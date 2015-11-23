(function(){
    "use strict"

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
    goHome.$inject = ['$state'];

    //////////////////

    function configureRoutes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "partials/main/home.tpl.html"
            });
        $urlRouterProvider.when('', goHome);
    }
    function goHome($state) {
        $state.go('home');
    };
})();