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
                //  TODO Remove Hardcoded Org ID
                orgId = IamUser['orgID'] ? IamUser['orgID'] : '100011942';
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

    myApp.service('UserService', ['User', 'ROLES', '$window', '$state', '$http', '$rootScope', 'FederalHierarchyService', 'localStorageService',
        function(User, ROLES, $window, $state, $http, $rootScope, FederalHierarchyService, localStorageService) {
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
                $http.defaults.headers.common['X-Auth-Token'] = Cookies.get('Rei-Sign-In-As') ? Cookies.get('Rei-Sign-In-As') : Cookies.get('iPlanetDirectoryPro');

                //load and store user organization ids (FH)
                this.fetchUserOrganizationIDs();
            };

            this.loadCLPUser = function() {
                if (Cookies.get('iPlanetDirectoryPro') || Cookies.get('Rei-Sign-In-As')) {
                    if ($window.iaeHeader) {
                        $window.skipInitialCheck = false;
                        this.loadingUser = true;
                        var self = this;
                        if (Cookies.get('Rei-Sign-In-As')) {
                            setTimeout(function() {
                                self.changeUser({
                                    "roles": [
                                        Cookies.get('Rei-Sign-In-As')
                                    ],
                                    'fullName': Cookies.get('Rei-Sign-In-As'),
                                    'username': Cookies.get('Rei-Sign-In-As'),
                                    'orgId': '100011942'
                                });
                                self.loadingUser = false;
                                $state.reload();
                            }, 3000);
                        } else {
                            $window.iaeHeader.getUser(function(u) {
                                self.changeUser(u);
                                self.loadingUser = false;
                                $state.reload();
                            });
                        }
                    } else if ($window.skipInitialCheck) {
                        $window.skipInitialCheck = false;
                        this.changeUser(null);
                        $state.reload();
                    } else {
                        $window.skipInitialCheck = true;
                    }
                }
            };

            this.isLoadingIamUser = function() {
                return this.loadingUser;
            };

            this.fetchUserOrganizationIDs = function(){
                if (this.getUserOrgId() !== null) {
                    //get user roles
                    var aUserRoles = [];
                    angular.forEach(this.getUserRoles(), function(oRole){
                        if(oRole.hasOwnProperty('iamRoleId')){
                            aUserRoles.push(oRole.iamRoleId);
                        }
                    });

                    //init  userOrganizationIDs storage with assigned orgID
                    localStorageService.set('userOrganizationIDs', [this.getUserOrgId()]);

                    //AGENCY_COORDINATOR: include children organizations
                    if (_.includes(aUserRoles, ROLES.AGENCY_COORDINATOR.iamRoleId)) {
                        FederalHierarchyService.getFederalHierarchyById(this.getUserOrgId(), false, true, 
                        function(data) {
                            var aOrgID = [data.elementId];
                            var fetchOrgIDsFn = function (oData) {
                                if(oData.hasOwnProperty('hierarchy') && oData.hierarchy.length > 0) {
                                    angular.forEach(oData.hierarchy, function(oRow) {
                                        aOrgID.push(oRow.elementId);
                                        fetchOrgIDsFn(oRow);
                                    });
                                }
                            };

                            fetchOrgIDsFn(data);

                            localStorageService.set('userOrganizationIDs', aOrgID);
                        }, 
                        function(err){
                            console.log(err);
                        });
                    }

                    //OMB_ANALYST and RMO_SUPER_USER: FECTH CUSTOM ORGANIZATION
                    if (_.includes(aUserRoles, ROLES.OMB_ANALYST.iamRoleId) || _.includes(aUserRoles, ROLES.RMO_SUPER_USER.iamRoleId)) {
                        //TODO API CALL BACK AND PUSH TO aOrgID
                        //aOrgID.push();
                        //localStorageService.set('userOrganizationIDs', aOrgID);
                    }
                } else {
                    localStorageService.set('userOrganizationIDs', []);
                }
            };

            this.getUserAllOrgIDs = function() {
                return localStorageService.get('userOrganizationIDs');
            };

            var self = this;
            angular.element($window).bind('load', function() {
                if ($window.skipInitialCheck) {
                    self.loadCLPUser();
                }
            });

            $http.defaults.headers.common['X-Auth-Token'] = Cookies.get('Rei-Sign-In-As') ? Cookies.get('Rei-Sign-In-As') : Cookies.get('iPlanetDirectoryPro');
        }
    ]);
}();