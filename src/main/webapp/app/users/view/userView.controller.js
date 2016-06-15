!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserViewCtrl', ['$stateParams', '$scope', 'UserProfile', 'ApiService', 'AuthorizationService', 'ROLES',
        function($stateParams, $scope, UserProfile, ApiService, AuthorizationService, ROLES) {
            $scope.canEditUser = function() {
                var hasPermission = false;

                if (AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR])) {
                    hasPermission = $scope.isAgencyUser() || $scope.isAgencyCoordinator();
                } else if (AuthorizationService.authorizeByRole([ROLES.RMO_SUPER_USER])) {
                    hasPermission = $scope.isOMBAnalyst();
                } else if (AuthorizationService.authorizeByRole([ROLES.SUPER_USER])) {
                    hasPermission = true;
                }

                return hasPermission;
            };

            $scope.isAgencyUser = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == ROLES.AGENCY_USER.iamRoleId) : false;
            };

            $scope.isAgencyCoordinator = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == ROLES.AGENCY_COORDINATOR.iamRoleId) : false;
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
                }
            );
        }
    ]);
}();