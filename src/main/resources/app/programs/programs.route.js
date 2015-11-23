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
                controller: "AddEditProgram as vm",
                resolve: {
                    program: createProgram
                }
            })
            .state('programs', {
                url: "/programs",
                templateUrl: "partials/programs/programs-list.tpl.html",
                controller: "ProgramsListController as vm"
            });
    }

    function createProgram(Program) {
        return new Program();
    }
})();