(function(){
    "use strict"

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider'];
    createProgram.$inject = ['Program'];

    //////////////////

    function configureRoutes($stateProvider) {
        $stateProvider
            .state('addProgram', {
                url: "/programs/add",
                templateUrl: "partials/programs/addedit.tpl.html",
                resolve: {
                    program: createProgram
                }
            });
    }

    function createProgram(Program) {
        return new Program();
    }
})();