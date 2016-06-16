!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserViewCtrl', ['$stateParams', '$scope', 'User', 'ApiService', 'AuthorizationService', 'SUPPORTED_ROLES',
        function($stateParams, $scope, User, ApiService, AuthorizationService, SUPPORTED_ROLES) {
            $scope.canEditUser = function() {
                var hasPermission = false;

                if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.AGENCY_COORDINATOR])) {
                    hasPermission = $scope.isAgencyUser() || $scope.isAgencyCoordinator();
                } else if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.RMO_SUPER_USER])) {
                    hasPermission = $scope.isOMBAnalyst();
                } else if (AuthorizationService.authorizeByRole([SUPPORTED_ROLES.SUPER_USER])) {
                    hasPermission = true;
                }

                return hasPermission;
            };

            $scope.isAgencyUser = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == SUPPORTED_ROLES.AGENCY_USER) : false;
            };

            $scope.isAgencyCoordinator = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == SUPPORTED_ROLES.AGENCY_COORDINATOR) : false;
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
                }
            );
        }
    ]);
}();