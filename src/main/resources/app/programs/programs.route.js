(function(){
    "use strict"

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
    createProgram.$inject = ['Program'];

    //////////////////

    function configureRoutes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('addProgram', {
                url: "/programs/add",
                templateUrl: "partials/programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm",
                resolve: {
                    program: createProgram
                }
            })
            .state('home', {
                url: "/",
                templateUrl: "partials/programs/programs-list.tpl.html",
                controller: "ProgramsListController as vm"
            });
        $urlRouterProvider.when('', goHome);
    }

    function goHome($state) {
        $state.go('home');
    };
    function createProgram(Program) {
        var program = new Program();
        program.agencyId = "REI Test Agency";
        return program;
    }
})();