!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserFormCtrl', ['$stateParams', '$scope', 'User', 'ApiService', 'AuthorizationService', 'SUPPORTED_ROLES', 'ngDialog', '$state', '$timeout',
        function($stateParams, $scope, User, ApiService, AuthorizationService, SUPPORTED_ROLES, ngDialog, $state, $timeout) {

            if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_COORDINATOR])) {
                $scope.cfdaRoles = [{
                    id: SUPPORTED_ROLES.AGENCY_USER,
                    value: "Agency User"
                }, {
                    id: SUPPORTED_ROLES.AGENCY_COORDINATOR,
                    value: "Agency Coordinator"
                }];
            } else if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.RMO_SUPER_USER])) {
                $scope.cfdaRoles = [{
                    id: SUPPORTED_ROLES.OMB_ANALYST,
                    value: "OMB Analyst"
                }];
            } else if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER])) {
                $scope.cfdaRoles = [{
                    id: SUPPORTED_ROLES.AGENCY_USER,
                    value: "Agency User"
                }, {
                    id: SUPPORTED_ROLES.AGENCY_COORDINATOR,
                    value: "Agency Coordinator"
                }, {
                    id: SUPPORTED_ROLES.OMB_ANALYST,
                    value: "OMB Analyst"
                }, {
                    id: SUPPORTED_ROLES.RMO_SUPER_USER,
                    value: "RMO Super User"
                }, {
                    id: SUPPORTED_ROLES.LIMITED_SUPER_USER,
                    value: "Limited Super User"
                }, {
                    id: SUPPORTED_ROLES.SUPER_USER,
                    value: "Super User"
                }];
            }

            $scope.saveUser = function() {
                if ($scope.isOMBAnalyst()) {
                    if ($scope.isCustomOrganizationType()) {
                        var orgIds = [];

                        angular.forEach($scope.assignedOrganizationList, function(value) {
                            orgIds.push(value);
                        });

                        $scope.userProfile.additionalInfo['assignedOrganizationIds'] = orgIds;
                    }
                }

                if ($scope.isAgencyUser()) {
                    //  Populate custom permissions
                    $scope.userProfile.additionalInfo['customRoles'] = $scope.customAgencyUserPermissions;
                }

                var oApiParam = {
                    apiName: 'userAPI',
                    apiSuffix: $stateParams.id,
                    oParams: {},
                    oData: $scope.userProfile,
                    method: 'PATCH'
                };

                ApiService.call(oApiParam).then(function() {
                    ngDialog.open({
                        template: '<div class="usa-alert usa-alert-success" role="alert">'+
                        '<div class="usa-alert-body">'+
                        '<p class="usa-alert-text">User has been saved successfully!</p>'+
                        '</div>'+
                        '</div>',
                        plain: true,
                        closeByEscape: true,
                        showClose: true
                    });

                    //go to list page after 2 seconds
                    $timeout(function() {
                        ngDialog.closeAll();
                        $state.go('userList');
                    }, 3000);
                });
            };

            $scope.addAssignedOrganization = function() {
                $scope.assignedOrganizationList[++$scope.assignedNextId] = $scope.userProfile.organizationId;
            };

            $scope.removeAssignedOrganization = function(key) {
                delete $scope.assignedOrganizationList[key];
            };

            $scope.isAgencyUser = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == SUPPORTED_ROLES.AGENCY_USER) : false;
            };

            $scope.isOMBAnalyst = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == SUPPORTED_ROLES.OMB_ANALYST) : false;
            };

            $scope.isRMOSuperUser = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == SUPPORTED_ROLES.RMO_SUPER_USER) : false;
            };

            $scope.isCustomOrganizationType = function() {
                return $scope.userProfile ? ($scope.userProfile.getOrganizationType() == 'custom') : false;
            };

            var oApiParam = {
                apiName: 'userAPI',
                apiSuffix: $stateParams.id,
                oParams: {},
                oData: {},
                method: 'GET'
            };

            ApiService.call(oApiParam).then(
                function (results) {
                    $scope.userProfile = new User(results);

                    //  Pull additional information out of object structure to easier consume
                    $scope.assignedOrganizationList = {};
                    $scope.assignedNextId = 0;

                    if ($scope.userProfile.getAssignedOrganizationIds()) {
                        angular.forEach($scope.userProfile.getAssignedOrganizationIds(), function(value, key) {
                            $scope.assignedOrganizationList[key] = value;
                            $scope.assignedNextId = key;
                        });
                    }

                    $scope.customAgencyUserPermissions = {};

                    if ($scope.isAgencyUser() && $scope.userProfile.getCustomRoles()) {
                        angular.forEach($scope.userProfile.getCustomRoles(), function(value, key) {
                            $scope.customAgencyUserPermissions[key] = true;
                        });
                    }
                }
            );
        }
    ]);
}();