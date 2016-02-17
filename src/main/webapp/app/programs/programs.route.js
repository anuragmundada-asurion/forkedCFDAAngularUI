(function(){
    "use strict";

    angular
        .module('app')
        .config(configureRoutes);

    configureRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
    createProgram.$inject = ['Program'];
    getProgram.$inject = ['$stateParams', 'Program'];
    getCoreDictionaries.$inject = ['Dictionary', 'appConstants'];

    //////////////////

    function configureRoutes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('addProgram', {
                url: "/programs/add/:section",
                templateUrl: "programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm",
                resolve: {
                    program: createProgram,
                    coreChoices: getCoreDictionaries
                }
            })
            .state('editProgram', {
                url: "/programs/:id/edit/:section",
                templateUrl: "programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm",
                resolve: {
                    program: getProgram,
                    coreChoices: getCoreDictionaries
                }
            })
            .state('home', {
                url: "/",
                templateUrl: "programs/programs-list.tpl.html",
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
        program._id = null;
        return program;
    }
    function getProgram($stateParams, Program) {
        var id = $stateParams.id;
        return Program.get({id: id}).$promise;
    }
    function getCoreDictionaries(Dictionary, appConstants) {
        return Dictionary.toDropdown({ ids: appConstants.CORE_DICTIONARIES.join(',') }).$promise;
    }
})();