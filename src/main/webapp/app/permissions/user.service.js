!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('User', ['PermissionService', 'ROLES', function(PermissionService, ROLES) {
        function User(IamUser) {
            var t = IamUser ? IamUser['token'] : null;
            var uid = t ? t['uid'] : null;
            var token = t ? t['access_token'] : null;
            var tokenExpiration = t ? t['expires_in'] : null;
            var roles = t ? t['gsaRAC'] : [];
            var permissions = [];

            roles.every(function(r) {
                var permissionList = PermissionService.getPermissionsFromIAMRole(r);
                permissionList.every(function(p) {
                    if (permissions.indexOf(p) === -1) {
                        return permissions.push(p);
                    }
                });
            });

            if (!permissions.length) {
                permissions = ROLES.ANONYMOUS.permissions;
            }

            return {
                uid: uid,
                token: token,
                tokenExpiration: tokenExpiration,
                roles: roles,
                permissions: permissions,
                iamUserObject: IamUser,
                getPermissions: function() {
                    return this.permissions ? this.permissions : [];
                }
            };
        }

        return User;
    }]);

    myApp.service('UserService', ['$rootScope', 'User', 'ROLES', function($rootScope, User, ROLES) {
        this.getUser = function() {
            if (!$rootScope.user) {
                $rootScope.user = new User();
            }

            return $rootScope.user;
        };

        this.getUserPermissions = function() {
            var user = this.getUser();
            return user ? user.getPermissions() : ROLES.ANONYMOUS.permissions;
        };

        this.changeUser = function(iamUser) {
            $rootScope.user = new User(iamUser);
        };
    }]);
}();