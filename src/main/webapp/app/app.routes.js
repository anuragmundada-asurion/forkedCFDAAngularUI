(function(){
    "use strict";

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "main/home.tpl.html",
                controller: "HomeController"
            })
            .state('404', {
                url: "/404",
                templateUrl: "httpcode/404.tpl.html"
            })
            .state('searchPrograms', {
                url: "/search?keyword",
                templateUrl: "search/results.tpl.html",
                controller: "ProgramSearchCtrl"
            })
            .state('addProgram', { 
                url: "/programs/add/:section",
                templateUrl: "programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm"
            })
            .state('editProgram', {
                url: "/programs/:id/edit/:section",
                templateUrl: "programs/addedit.tpl.html",
                controller: "AddEditProgram as gsavm"
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
            })
            .state('agencyList', {
                url: "/agency/main",
                templateUrl: "agency/agency-list.tpl.html",
                controller: "AgencyListController"
            });

         // the known route
        $urlRouterProvider.when('', '/');

        // For any unmatched url, send to 404
        $urlRouterProvider.otherwise('/404');
    }]);
})();