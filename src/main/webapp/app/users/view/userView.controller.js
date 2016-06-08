!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('UserViewCtrl', ['$stateParams', '$scope', 'UserProfile', 'ApiService', 'AuthorizationService', 'ROLES',
        function($stateParams, $scope, UserProfile, ApiService, AuthorizationService, ROLES) {
            $scope.canEditUser = function() {
                return AuthorizationService.authorizeByRole([ROLES.AGENCY_COORDINATOR, ROLES.SUPER_USER, ROLES.RMO_SUPER_USER, ROLES.LIMITED_SUPER_USER]);
            };

            $scope.isOMBAnalyst = function() {
                return $scope.user.getRole() == ROLES.OMB_ANALYST.iamRoleId;
            };

            var oApiParam = {
                apiName: 'userEntity',
                apiSuffix: $stateParams.id,
                oParams: {},
                oData: {},
                method: 'GET'
            };

            ApiService.call(oApiParam).then(
                function (results) {
                    $scope.user = new UserProfile(results);
                }
            );
        }
    ]);
}();