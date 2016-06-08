!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserViewCtrl', ['$stateParams', '$scope', 'UserProfile', 'ApiService', 'AuthorizationService', 'ROLES',
        function($stateParams, $scope, UserProfile, ApiService, AuthorizationService, ROLES) {
            $scope.canEditUser = function() {
                return AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR, ROLES.SUPER_USER, ROLES.RMO_SUPER_USER, ROLES.LIMITED_SUPER_USER]);
            };

            $scope.isOMBAnalyst = function() {
                return $scope.userProfile ? ($scope.userProfile.getRole() == ROLES.OMB_ANALYST.iamRoleId) : false;
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