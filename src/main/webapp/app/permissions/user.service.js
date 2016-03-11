!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('User', ['PermissionService', 'ROLES', function(PermissionService, ROLES) {
        function User(IamUser) {
            var uid = IamUser ? IamUser['uid'] : null;
            var token = IamUser ? IamUser['tokenId'] : null;
            var roles = IamUser ? IamUser['gsaRAC'] : [];
            var permissions = [];

            roles.every(function(r) {
                var permissionList = PermissionService.getPermissionsFromIAMRole(r);
                permissionList.every(function(p) {
                    if (permissions.indexOf(p) === -1) {
                        permissions.push(p);
                    }
                    return true;
                });
            });

            return {
                uid: uid,
                token: token,
                roles: roles,
                permissions: permissions,
                getPermissions: function() {
                    return this.permissions ? this.permissions : [];
                }
            };
        }

        return User;
    }]);

    myApp.service('UserService', ['$rootScope', 'User', 'ROLES', function($rootScope, User, ROLES) {
        this.getUser = function() {
            var iaeUser = window.iaeHeader ? window.iaeHeader.getUser() : null;

            if (!$rootScope.iamUser || $rootScope.iamUser != iaeUser) {
                $rootScope.iamUser = window.iaeHeader ? window.iaeHeader.getUser() : null;
                $rootScope.user = new User($rootScope.iamUser);
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