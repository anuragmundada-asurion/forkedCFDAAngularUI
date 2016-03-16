!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('User', ['RoleService', 'ROLES', function(RoleService, ROLES) {
        function User(IamUser) {
            var uid = IamUser ? IamUser['uid'] : null;
            var token = IamUser ? IamUser['tokenId'] : null;
            var roles = IamUser ? IamUser['gsaRAC'] : null;
            var roleList = [];
            var permissions = [];

            if (roles) {
                roles.forEach(function(r) {
                    var role = RoleService.getRoleFromIAMRole(r);
                    if (role) {
                        roleList.push(role);
                        role.permissions.forEach(function(p) {
                            if (permissions.indexOf(p) === -1) {
                                permissions.push(p);
                            }
                        });
                    }
                });
            } else {
                roleList.push(ROLES.ANONYMOUS);
                permissions = ROLES.ANONYMOUS.permissions;
            }

            return {
                uid: uid,
                token: token,
                roles: roleList,
                permissions: permissions,
                getPermissions: function() {
                    return this.permissions ? this.permissions : [];
                },
                getRoles: function() {
                    return this.roles ? this.roles : [];
                }
            };
        }

        return User;
    }]);

    myApp.service('UserService', ['$rootScope', 'User', 'ROLES', '$document', function($rootScope, User, ROLES, $document) {
        this.getUser = function() {
            this.refreshUser();

            if (!$rootScope.user) {
                $rootScope.user = new User();
            }

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