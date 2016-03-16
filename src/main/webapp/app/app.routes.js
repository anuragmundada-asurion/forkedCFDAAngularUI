(function(){
    "use strict";

    angular.module('app').config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'PERMISSIONS',
        function ($locationProvider, $stateProvider, $urlRouterProvider, PERMISSIONS) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $stateProvider
                .state('home', {
                    url: "/",
                    templateUrl: "main/home.tpl.html",
                    controller: "HomeController"
                })
                .state('401', {
                    url: "/unauthorized",
                    templateUrl: "httpcode/401.tpl.html"
                })
                .state('403', {
                    url: "/forbidden",
                    templateUrl: "httpcode/403.tpl.html"
                })
                .state('404', {
                    url: "/404",
                    templateUrl: "httpcode/404.tpl.html"
                })
                .state('500', {
                    url: "/error",
                    templateUrl: "httpcode/500.tpl.html"
                })
                .state('searchPrograms', {
                    url: "/search?keyword",
                    templateUrl: "search/results.tpl.html",
                    controller: "ProgramSearchCtrl"
                })
                .state('advancedSearch', {
                    url: "/advanced-search",
                    templateUrl: "search/_AdvancedSearch.tpl.html",
                    controller: "ProgramSearchCtrl"
                })
                .state('addProgram', {
                    url: "/programs/add/:section",
                    templateUrl: "programs/addedit.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_PROGRAMS
                        ]
                    }
                })
                .state('editProgram', {
                    url: "/programs/:id/edit/:section",
                    templateUrl: "programs/addedit.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS
                        ]
                    }
                })
                .state('reviewProgram', {
                    url: "/programs/:id/edit/review",
                    templateUrl: "programs/addedit.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_REVIEW_PROGRAMS
                        ]
                    }
                })
                .state('programList', {
                    url: "/programs/main",
                    templateUrl: "programs/programs-list.tpl.html",
                    controller: "ProgramsListCtrl",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PROGRAMS,
                            PERMISSIONS.CAN_REVIEW_PROGRAMS,
                            PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                            PERMISSIONS.CAN_APPROVE_TITLE_CHANGE,
                            PERMISSIONS.CAN_REQUEST_ARCHIVE,
                            PERMISSIONS.CAN_APPROVE_ARCHIVE,
                            PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                            PERMISSIONS.CAN_APPROVE_UNARCHIVE
                        ]
                    }
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
                    controller: 'ProgramsListCtrl',
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PROGRAMS,
                            PERMISSIONS.CAN_REVIEW_PROGRAMS,
                            PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                            PERMISSIONS.CAN_APPROVE_TITLE_CHANGE,
                            PERMISSIONS.CAN_REQUEST_ARCHIVE,
                            PERMISSIONS.CAN_APPROVE_ARCHIVE,
                            PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                            PERMISSIONS.CAN_APPROVE_UNARCHIVE
                        ]
                    }
                })
                .state('agencyList', {
                    url: "/agency/main",
                    templateUrl: "agency/agency-list.tpl.html",
                    controller: "AgencyListController"
                }).state('agencyDetails', {
                      url: "/agency/:action/:id", //action = review, edit or create
                      templateUrl: "agency/agency-details.tpl.html",
                      controller: "AgencyDetailsController"
                });

             // the known route
            $urlRouterProvider.when('', '/');

            // For any unmatched url, send to 404
            $urlRouterProvider.otherwise('/404');
        }
    ]);
})();
