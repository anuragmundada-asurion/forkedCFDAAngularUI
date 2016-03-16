!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('User', ['PermissionService', function(PermissionService) {
        function User(IamUser) {
            var uid = IamUser ? IamUser['uid'] : null;
            var token = IamUser ? IamUser['tokenId'] : null;
            var roles = IamUser ? IamUser['gsaRAC'] : [];
            var permissions = [];

            if (roles) {
                roles.every(function(r) {
                    var permissionList = PermissionService.getPermissionsFromIAMRole(r);
                    permissionList.every(function(p) {
                        if (permissions.indexOf(p) === -1) {
                            permissions.push(p);
                        }
                        return true;
                    });
                });
            }

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

    myApp.service('UserService', ['$rootScope', 'User', 'ROLES', '$document', function($rootScope, User, ROLES, $document) {
        this.getUser = function() {
            this.refreshUser();
            return $rootScope.user;
        };

        this.refreshUser = function() {
            var iaeUser = window.iaeHeader ? window.iaeHeader.getUser() : null;

            //  If there is a user object
            if (iaeUser) {
                //  If no user object is being held OR user object being held doesn't match new user object
                if (!$rootScope.iamUser || $rootScope.iamUser != iaeUser) {
                    //  Change user
                    $rootScope.iamUser = window.iaeHeader ? window.iaeHeader.getUser() : null;
                    $rootScope.user = new User($rootScope.iamUser);
                }
            }
        };

        this.getUserPermissions = function() {
            var user = this.getUser();
            return user ? user.getPermissions() : ROLES.ANONYMOUS.permissions;
        };

        this.changeUser = function(iamUser) {
            $rootScope.user = new User(iamUser);
        };

        var self = this;
        $document.ready(function() {
             self.refreshUser();
        });
    }]);
}();