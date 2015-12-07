(function(){
    "use strict";

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
    createProgram.$inject = ['Program'];
    getProgram.$inject = ['$stateParams', 'Program'];

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
            .state('editProgram', {
                url: "/programs/:id/edit",
                templateUrl: "partials/programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm",
                resolve: {
                    program: getProgram
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
    }
    function createProgram(Program) {
        var program = new Program();
        program.agencyId = "REI Test Agency";
        return program;
    }
    function getProgram($stateParams, Program) {
        var id = $stateParams.id;
        return id ? Program.get({id: id}).$promise : createProgram(Program);
    }
})();