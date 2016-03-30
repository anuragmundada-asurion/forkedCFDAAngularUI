!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.factory('User', ['RoleService', 'ROLES', function(RoleService, ROLES) {
        function User(IamUser) {
            var uname, email, fname, roles, lname, fullName, phone, orgId;
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
                orgId = IamUser['orgId'] ? IamUser['orgId'] : '100500255';
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
                orgId: orgId,
                roles: roleList,
                permissions: permissions
            };
        }

        return User;
    }]);

    myApp.service('UserService', ['User', 'ROLES', '$document', '$state', '$http', '$rootScope',
        function(User, ROLES, $document, $state, $http, $rootScope) {
            this.loadingUser = false;

            this.getUser = function() {
                return $rootScope.user;
            };

            this.getUserRoles = function() {
                var user = this.getUser();
                return user ? user.roles : [ROLES.ANONYMOUS];
            };

            this.getUserPermissions = function() {
                var user = this.getUser();
                return user ? user.permissions : ROLES.ANONYMOUS.permissions;
            };

            this.getUserOrgId = function() {
                var user = this.getUser();
                return user ? user.orgId : null;
            };

            this.changeUser = function(iamUser) {
                $rootScope.user = new User(iamUser);
                $http.defaults.headers.common['X-Auth-Token'] = Cookies.get('iplanetDirectoryPro');
            };

            this.loadCLPUser = function() {
                if (Cookies.get('iplanetDirectoryPro')) {
                    if (window.iaeHeader) {
                        window.skipInitialCheck = false;
                        this.loadingUser = true;
                        var self = this;
                        setTimeout(function() {
                            self.changeUser({
                                "roles": [
                                    Cookies.get('iplanetDirectoryPro')
                                ],
                                'fullName': Cookies.get('iplanetDirectoryPro'),
                                'username': Cookies.get('iplanetDirectoryPro'),
                                'orgId': '100500255'
                            });
                            self.loadingUser = false;
                            $state.reload();
                        }, 3000);
                        //window.iaeHeader.getUser(function(u) {
                        //    self.changeUser(u);
                        //    self.loadingUser = false;
                        //    $state.reload();
                        //});
                    } else {
                        window.skipInitialCheck = !window.skipInitialCheck;
                    }
                }
            };

            this.isLoadingIamUser = function() {
                return this.loadingUser;
            };

            var self = this;
            $document.ready(function() {
                if (window.skipInitialCheck) {
                    self.loadCLPUser();
                }
            });

            $http.defaults.headers.common['X-Auth-Token'] = Cookies.get('iplanetDirectoryPro');
        }
    ]);
}();