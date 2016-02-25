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
                templateUrl: "main/home.tpl.html",
                controller: "HomeController as vm"
            })
            .state('programList', {
                url: "/programs/main",
                templateUrl: "programs/programs-list.tpl.html",
                controller: "ProgramsListCtrl"
            })
            .state('programList.status', {
                url: '/:status',
                templateUrl:  function ($stateParams) {
                    if($stateParams.status && $stateParams.status === 'pending') {
                        return 'programs/programs-list-table-pending.tpl.html';
                    } else if($stateParams.status && $stateParams.status === 'archived') {
                        return 'programs/programs-list-table-archived.tpl.html';
                    } else if($stateParams.status && $stateParams.status === 'published'){
                        return 'programs/programs-list-table-published.tpl.html';
                    } else if($stateParams.status && $stateParams.status === 'requests'){
                        return 'programs/programs-list-table-requests.tpl.html';
                    } else {
                        return 'programs/programs-list-table-all.tpl.html';
                    }
                },
                controller: 'ProgramsListCtrl'
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