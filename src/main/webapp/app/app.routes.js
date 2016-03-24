(function () {
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
                .state('previewProgram', {
                    url: "/programs/:id/preview",
                    templateUrl: "programs/view/viewProgram.tpl.html",
                    controller: "ViewProgramCtrl as viewCtrl",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS
                        ]
                    }
                })
                .state('editProgram', {
                    url: "/programs/:id/edit/:section",
                    templateUrl: "programs/addedit.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS
                        ]
                    }
                })
                .state('reviewProgram', {
                    url: "/programs/:id/review",
                    templateUrl: "programs/review.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_REVIEW_PROGRAMS
                        ]
                    }
                })
                .state('viewProgram', {
                    url: "/programs/:id/view",
                    templateUrl: "programs/view/viewProgram.tpl.html",
                    controller: "ViewProgramCtrl as viewCtrl",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_VIEW_PROGRAM
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
                            PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS,
                            PERMISSIONS.CAN_REVIEW_PROGRAMS,
                            PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                            PERMISSIONS.CAN_PERFORM_TITLE_CHANGE,
                            PERMISSIONS.CAN_REQUEST_ARCHIVE,
                            PERMISSIONS.CAN_PERFORM_TITLE_CHANGE,
                            PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                            PERMISSIONS.CAN_PERFORM_UNARCHIVE,
                            PERMISSIONS.CAN_REQUEST_SUBMISSION,
                            PERMISSIONS.CAN_PERFORM_SUBMISSION
                        ]
                    }
                })
                .state('programList.status', {
                    url: '/:status',
                    templateUrl: function ($stateParams) {
                        if ($stateParams.status && $stateParams.status === 'pending') {
                            return 'programs/programs-list-table-pending.tpl.html';
                        } else if ($stateParams.status && $stateParams.status === 'archived') {
                            return 'programs/programs-list-table-archived.tpl.html';
                        } else if ($stateParams.status && $stateParams.status === 'published') {
                            return 'programs/programs-list-table-published.tpl.html';
                        } else if ($stateParams.status && $stateParams.status === 'requests') {
                            return 'programs/programs-list-table-requests.tpl.html';
                        } else {
                            return 'programs/programs-list-table-all.tpl.html';
                        }
                    },
                    controller: 'ProgramsListCtrl',
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS,
                            PERMISSIONS.CAN_REVIEW_PROGRAMS,
                            PERMISSIONS.CAN_REQUEST_TITLE_CHANGE,
                            PERMISSIONS.CAN_PERFORM_TITLE_CHANGE,
                            PERMISSIONS.CAN_REQUEST_ARCHIVE,
                            PERMISSIONS.CAN_PERFORM_TITLE_CHANGE,
                            PERMISSIONS.CAN_REQUEST_UNARCHIVE,
                            PERMISSIONS.CAN_PERFORM_UNARCHIVE,
                            PERMISSIONS.CAN_REQUEST_SUBMISSION,
                            PERMISSIONS.CAN_PERFORM_SUBMISSION
                        ]
                    }
                })
                .state('regionalOfficeList', {
                    url: "/regionalOffice",
                    templateUrl: "office/office-list.tpl.html",
                    controller: "RegionalOfficeListController",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
                        ]
                    }
                }).state('viewRegionalOffice', {
                    url: "/regionalOffice/:id",
                    templateUrl: "agency/office-view.tpl.html",
                    controller: "RegionalOfficeViewController",
                access: {
                    requiredPermissions: [
                        PERMISSIONS.CAN_VIEW_REGIONAL_OFFICE
                    ]
                }
                }).state('createRegionalOffice', {
                    url: "/regionalOffice/create",
                    templateUrl: "agency/office-form.tpl.html",
                    controller: "RegionalOfficeEditController",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE
                        ]
                    }
                }).state('editRegionalOffice', {
                    url: "/regionalOffice/:id/edit",
                    templateUrl: "office/office-form.tpl.html",
                    controller: "RegionalOfficeEditController",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE
                        ]
                    }
                });

            // the known route
            $urlRouterProvider.when('', '/');

            // For any unmatched url, send to 404
            $urlRouterProvider.otherwise('/404');
        }
    ]);
})();
