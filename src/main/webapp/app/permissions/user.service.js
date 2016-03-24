!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('User', ['RoleService', 'ROLES', function(RoleService, ROLES) {
        function User(IamUser) {
            var uname, email, fname, roles, lname, fullName, phone;
            var roleList = [];
            var permissions = [];

            if (IamUser) {
                uname = IamUser['username'];
                email = IamUser['emailAddress'];
                fname = IamUser['firstName'];
                roles = IamUser['roles'];
                lname = IamUser['lastName'];
                fullName = IamUser['fullName'];
                phone = IamUser['phoneNumber'];
            }

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
                email: email,
                firstName: fname,
                lastName: lname,
                fullName: fullName,
                uid: uname,
                phone: phone,
                roles: roleList,
                permissions: permissions
            };
        }

        return User;
    }]);

    myApp.service('UserService', ['$rootScope', 'User', 'ROLES', '$document', function($rootScope, User, ROLES, $document) {
        this.getUser = function() {
            return $rootScope.user;
        };

        this.refreshUser = function() {
            if (window.iaeHeader) {
                var self = this;
                window.iaeHeader.getUser(function(u) {
                    self.changeUser(u);
                });
            }
        };

        this.getUserRoles = function() {
            var user = this.getUser();
            return user ? user.roles : [ROLES.ANONYMOUS];
        };

        this.getUserPermissions = function() {
            var user = this.getUser();
            return user ? user.permissions : ROLES.ANONYMOUS.permissions;
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