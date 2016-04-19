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
                    controller: "HomeController",
                    title: 'Home - CFDA: Home'
                })
                .state('401', {
                    url: "/unauthorized",
                    templateUrl: "httpcode/401.tpl.html",
                    title: 'Unauthorized - CFDA: Unauthorized'
                })
                .state('403', {
                    url: "/forbidden",
                    templateUrl: "httpcode/403.tpl.html",
                    title: 'Forbidden - CFDA: Forbidden'
                })
                .state('404', {
                    url: "/404",
                    templateUrl: "httpcode/404.tpl.html",
                    title: 'Page Not Found - CFDA: Page Not Found'
                })
                .state('500', {
                    url: "/error",
                    templateUrl: "httpcode/500.tpl.html",
                    title: 'Server Error - CFDA: Server Error'
                })
                .state('searchPrograms', {
                    url: "/search?keyword",
                    templateUrl: "search/results.tpl.html",
                    controller: "ProgramSearchCtrl",
                    title: 'Search Programs - CFDA: Search Programs'
                })
                .state('advancedSearch', {
                    url: "/advanced-search",
                    templateUrl: "search/_AdvancedSearch.tpl.html",
                    controller: "ProgramSearchCtrl",
                    title: 'Search Programs - CFDA: Search Programs'
                })
                .state('addProgram', {
                    url: "/programs/add/:section",
                    templateUrl: "programs/addedit.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    title: 'Create Program - CFDA: Create Program',
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
                    title: 'Preview Program - CFDA: Preview Program',
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS
                        ]
                    },
                    data: {
                        onPreviewPage: true
                    }
                })
                .state('editProgram', {
                    url: "/programs/:id/edit/:section",
                    templateUrl: "programs/addedit.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    title: 'Edit Program - CFDA: Edit Program',
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_DRAFT_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PENDING_PROGRAMS,
                            PERMISSIONS.CAN_EDIT_PUBLISHED_PROGRAMS
                        ]
                    }
                })
                .state('reviewProgram', {
                    url: "/programs/:id/review",
                    templateUrl: "programs/review.tpl.html",
                    controller: "AddEditProgram as gsavm",
                    title: 'Review Program - CFDA: Review Program',
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
                    data: {
                        onPreviewPage: false
                    }

                })
                .state('programList', {
                    url: "/programs?list&filter",
                    title: 'My Listings - CFDA: My Listings',
                    templateUrl: "programs/list/myListings.tpl.html",
                    controller: "MyListingsCtrl",
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
                    controller: "RegionalOfficeListController as officeListCtrl",
                    title: 'Regional Agency Offices - CFDA: Regional Agency Offices',
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE,
                            PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE,
                            PERMISSIONS.CAN_DELETE_REGIONAL_OFFICE
                        ]
                    }
                })
                .state('addRegionalOffice', {
                    url: "/regionalOffice/create",
                    templateUrl: "office/office-form.tpl.html",
                    controller: "RegionalOfficeFormCtrl",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE
                        ]
                    }
                })
                .state('editRegionalOffice', {
                    url: "/regionalOffice/:id/edit",
                    templateUrl: "office/office-form.tpl.html",
                    controller: "RegionalOfficeFormCtrl",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE
                        ]
                    }
                })
                .state('viewRegionalOffice', {
                    url: "/regionalOffice/:id/view",
                    templateUrl: "office/office-view.tpl.html",
                    controller: "RegionalOfficeViewCtrl",
                    title: 'View Regional Agency Offices - CFDA: View Regional Agency Offices'
                })
                .state('organizationList', {
                    url: "/organization",
                    templateUrl: "organization/organization-list.tpl.html",
                    controller: "OrganizationListController as orgListCtrl",
                    title: 'Organizations - CFDA: Organizations Listing',

                    //TODO: update permissions
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE,
                            PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE,
                            PERMISSIONS.CAN_DELETE_REGIONAL_OFFICE
                        ]
                    }
                })
                //.state('addRegionalOffice', {
                //    url: "/organization/create",
                //    templateUrl: "organization/organization-form.tpl.html",
                //    controller: "OrganizationFormCtrl",
                //    access: {
                //        requiredPermissions: [
                //            PERMISSIONS.CAN_CREATE_REGIONAL_OFFICE
                //        ]
                //    }
                //})
                .state('editOrganization', {
                    url: "/organization/:id/edit",
                    templateUrl: "organization/organization-form.tpl.html",
                    controller: "OrganizationFormCtrl",
                    access: {
                        requiredPermissions: [
                            PERMISSIONS.CAN_EDIT_REGIONAL_OFFICE
                        ]
                    }
                })
                .state('viewOrganization', {
                    url: "/organization/:id/view",
                    templateUrl: "organization/organization-view.tpl.html",
                    controller: "OrganizationViewCtrl",
                    title: 'View Organization - CFDA: View Organization'
                });

            // the known route
            $urlRouterProvider.when('', '/');

            // For any unmatched url, send to 404
            $urlRouterProvider.otherwise('/404');
        }
    ]);
})();
