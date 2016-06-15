!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserFormCtrl', ['$stateParams', '$scope', 'UserProfile', 'ApiService', 'AuthorizationService', 'ROLES', 'ngDialog', '$state', '$timeout',
        function($stateParams, $scope, UserProfile, ApiService, AuthorizationService, ROLES, ngDialog, $state, $timeout) {
            if (AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR])) {
                $scope.cfdaRoles = [{
                    id: ROLES.AGENCY_USER.iamRoleId,
                    value: "Agency User"
                }, {
                    id: ROLES.AGENCY_COORDINATOR.iamRoleId,
                    value: "Agency Coordinator"
                }];
            } else if (AuthorizationService.authorizeByRole([ROLES.RMO_SUPER_USER])) {
                $scope.cfdaRoles = [{
                    id: ROLES.OMB_ANALYST.iamRoleId,
                    value: "OMB Analyst"
                }];
            } else if (AuthorizationService.authorizeByRole([ROLES.SUPER_USER])) {
                $scope.cfdaRoles = [{
                    id: ROLES.AGENCY_USER.iamRoleId,
                    value: "Agency User"
                }, {
                    id: ROLES.AGENCY_COORDINATOR.iamRoleId,
                    value: "Agency Coordinator"
                }, {
                    id: ROLES.OMB_ANALYST.iamRoleId,
                    value: "OMB Analyst"
                }, {
                    id: ROLES.RMO_SUPER_USER.iamRoleId,
                    value: "RMO Super User"
                }, {
                    id: ROLES.LIMITED_SUPER_USER.iamRoleId,
                    value: "Limited Super User"
                }, {
                    id: ROLES.SUPER_USER.iamRoleId,
                    value: "Super User"
                }];
            }

            $scope.saveUser = function() {
                if ($scope.isCustomOrganizationType()) {
                    var orgIds = [];

                    angular.forEach($scope.assignedOrganizationList, function(value) {
                        orgIds.push(value);
                    });

                    $scope.userProfile.additionalInfo['assignedOrganizationIds'] = orgIds;
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
                return $scope.userProfile ? ($scope.userProfile.getRole() == ROLES.AGENCY_USER.iamRoleId) : false;
            };

            $scope.isOMBAnalyst = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == ROLES.OMB_ANALYST.iamRoleId) : false;
            };

            $scope.isRMOSuperUser = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == ROLES.RMO_SUPER_USER.iamRoleId) : false;
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
                    $scope.userProfile = new UserProfile(results);

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