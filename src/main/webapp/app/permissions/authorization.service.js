!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('AuthorizationService', ['UserService', 'SUPPORTED_ROLES', function(UserService, SUPPORTED_ROLES) {
        this.authorize = function(requiredPermissions) {
            var userPermissions = UserService.getUserPermissions();

            var hasPermission = false;
            if (requiredPermissions) {
                if (!angular.isArray(requiredPermissions)) {
                    requiredPermissions = [requiredPermissions];
                }

                if (requiredPermissions.length) {
                    requiredPermissions.every(function(requiredPermission) {
                        if (userPermissions.indexOf(requiredPermission) !== -1) {
                            hasPermission = true;
                            return false;
                        }

                        return true;
                    });
                }
            }

            return hasPermission;
        };

        /**
         * Authorize user by role
         * @param aRequiredRoles Array
         * @returns Boolean
         */
        this.authorizeByRole = function(aRequiredRoles) {
            var oUserRole = UserService.getUserRole();
            var hasRole = false;

            if (aRequiredRoles && aRequiredRoles.length) {
                aRequiredRoles.every(function(oRequiredRole) {
                    if (angular.equals(oUserRole, oRequiredRole)) {
                        hasRole = true;
                        return false;
                    }

                    return true;
                });
            }

            return hasRole;
        };

        /**
         * Authorize user by organization
         * @param Integer orgID
         * @returns Boolean
         */
        this.authorizeByOrganization = function(orgID) {
            //authorized users has access to all organizations
            if(UserService.hasUserAllOrgIDs() || this.authorizeByRole([SUPPORTED_ROLES.SUPER_USER, SUPPORTED_ROLES.LIMITED_SUPER_USER])) {
                return true;
            } else {
                return (_.includes(UserService.getUserAllOrgIDs(), orgID));
            }
        };
    }]);

    myApp.run(['$rootScope', 'AuthorizationService', function($rootScope, AuthorizationService) {
        $rootScope.hasRole = function(rolesRequired) {
            return AuthorizationService.authorizeByRole(rolesRequired);
        };

        $rootScope.hasPermission = function(permissionsRequired) {
            return AuthorizationService.authorize(permissionsRequired);
        }
    }]);
}();