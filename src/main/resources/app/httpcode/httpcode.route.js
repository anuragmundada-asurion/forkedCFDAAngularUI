(function(){
    "use strict";

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider', '$urlRouterProvider']

    //////////////////

    function configureRoutes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('404', {
                url: "/404",
                templateUrl: "partials/httpcode/404.tpl.html"
            });

        $urlRouterProvider.otherwise(redirectToNotFound);

        redirectToNotFound.$inject = ['$injector'];

        //////////////

        function redirectToNotFound($injector) {
            var $state = $injector.get('$state');
            $state.go('404', {}, {
                location: false
            });
        }
    }
})();