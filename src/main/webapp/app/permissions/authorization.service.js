!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('AuthorizationService', ['UserService', function(UserService) {
        this.authorize = function(requiredPermissions) {
            var userPermissions = UserService.getUserPermissions();

            var hasPermission = false;
            if (requiredPermissions && requiredPermissions.length) {
                requiredPermissions.every(function(requiredPermission) {
                    if (userPermissions.indexOf(requiredPermission) !== -1) {
                        hasPermission = true;
                        return false;
                    }

                    return true;
                });
            }

            return hasPermission;
        };

        /**
         * Authorize user by role
         * @param aRequiredRoles Array
         * @returns Boolean
         */
        this.authorizeByRole = function(aRequiredRoles) {
            var oUserRoles = UserService.getUserRoles();
            var aUserRoles = [];
            var hasRole = false;

            //get roles from User (usually always one but we count for more)
            angular.forEach(oUserRoles, function(oRole){
                if(oRole.hasOwnProperty('iamRoleId')){
                    aUserRoles.push(oRole.iamRoleId);
                }
            });

            if (aRequiredRoles && aRequiredRoles.length) {
                aRequiredRoles.every(function(oRequiredRole) {
                    if (aUserRoles.indexOf(oRequiredRole.iamRoleId) !== -1) {
                        hasRole = true;
                        return false;
                    }

                    return true;
                });
            }

            return hasRole;
        };
    }]);
}();