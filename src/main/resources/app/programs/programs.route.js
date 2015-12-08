(function(){
    "use strict";

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
    createProgram.$inject = ['Program'];
    getProgram.$inject = ['$stateParams', 'Program'];
    getCoreDictionaries.$inject = ['Dictionary'];

    var CORE_DICTIONARIES = [
        'yes_no',
        'yes_na',
        'yes_no_na'
    ];

    //////////////////

    function configureRoutes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('addProgram', {
                url: "/programs/add",
                templateUrl: "partials/programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm",
                resolve: {
                    program: createProgram,
                    coreChoices: getCoreDictionaries
                }
            })
            .state('editProgram', {
                url: "/programs/:id/edit",
                templateUrl: "partials/programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm",
                resolve: {
                    program: getProgram,
                    coreChoices: getCoreDictionaries
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
    function getCoreDictionaries(Dictionary) {
        return Dictionary.toDropdown({ id: CORE_DICTIONARIES.join(',') }).$promise;
    }
})();