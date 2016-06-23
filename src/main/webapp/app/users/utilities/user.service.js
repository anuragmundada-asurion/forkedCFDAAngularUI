!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('UserService', ['User', 'SUPPORTED_ROLES', 'ROLES', '$window', '$state', '$http', '$rootScope', 'FederalHierarchyService', 'localStorageService', 'ApiService',
        function(User, SUPPORTED_ROLES, ROLES, $window, $state, $http, $rootScope, FederalHierarchyService, localStorageService, ApiService) {
            this.loadingUser = false;

            this.getUser = function() {
                return $rootScope.user;
            };

            this.getUserRole = function() {
                var user = this.getUser();
                return user ? user.role : [];
            };

            this.getUserPermissions = function() {
                var user = this.getUser();
                return user ? user.permissions : [];
            };

            this.getUserOrgId = function() {
                var user = this.getUser();
                return user ? user.organizationId : null;
            };

            this.clearUser = function() {
                $rootScope.user = null;
                delete $http.defaults.headers.common['X-Auth-Token'];
                localStorageService.remove('userOrganizationIDs');
            };

            this.setUser = function(user) {
                $rootScope.user = new User(user);
                $http.defaults.headers.common['X-Auth-Token'] = Cookies.get('Rei-Sign-In-As') ? Cookies.get('Rei-Sign-In-As') : Cookies.get('iPlanetDirectoryPro');

                //load and store user organization ids (FH)
                this.fetchUserOrganizationIDs();
            };

            this.loadCLPUser = function() {
                var self = this;
                if (Cookies.get('iPlanetDirectoryPro')) {
                    if ($window.iaeHeader) {
                        $window.skipInitialCheck = false;
                        this.loadingUser = true;
                        $window.iaeHeader.getUser(function(u) {
                            var userId = u['username'];

                            var oApiParam = {
                                apiName: 'userAPI',
                                apiSuffix: userId,
                                oParams: {},
                                oData: {},
                                method: 'GET'
                            };

                            ApiService.call(oApiParam).then(
                                function (results) {
                                    self.setUser(results);
                                    self.loadingUser = false;
                                    $state.reload();
                                }
                            );
                        });
                    } else if ($window.skipInitialCheck) {
                        $window.skipInitialCheck = false;
                        this.setUser(null);
                        $state.reload();
                    } else {
                        $window.skipInitialCheck = true;
                    }
                } else if (Cookies.get('Rei-Sign-In-As')) {
                    $window.skipInitialCheck = false;
                    this.loadingUser = true;
                    setTimeout(function() {
                        self.setUser({
                            "id": Cookies.get('Rei-Sign-In-As'),
                            "fullName": Cookies.get('Rei-Sign-In-As'),
                            "role": Cookies.get('Rei-Sign-In-As'),
                            "email": "cfda.test.users@gmail.com",
                            "organizationId": "100011942"
                        });
                        self.loadingUser = false;
                        $state.reload();
                    }, 3000);
                }
            };

            this.isLoadingIamUser = function() {
                return this.loadingUser;
            };

            this.fetchUserOrganizationIDs = function(){
                localStorageService.set('hasUserAllOrganizationIDs', false);

                if (this.getUserOrgId() !== null) {
                    //init  userOrganizationIDs storage with assigned orgID
                    localStorageService.set('userOrganizationIDs', [this.getUserOrgId()]);

                    //AGENCY_COORDINATOR: include children organizations
                    if (angular.equals(this.getUserRole(), SUPPORTED_ROLES.AGENCY_COORDINATOR)) {
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
                    if (angular.equals(this.getUserRole(), SUPPORTED_ROLES.OMB_ANALYST) || angular.equals(this.getUserRole(), SUPPORTED_ROLES.RMO_SUPER_USER)) {
                        console.log('.getUser().getOrganizationType()', this.getUser().getOrganizationType());
                        
                        if(this.getUser().getOrganizationType() === 'custom') {
                            if(angular.isArray(this.getUser().getAssignedOrganizationIds()) && this.getUser().getAssignedOrganizationIds().length > 0) {
                                console.log('Custom arrays: ', [this.getUserOrgId()].concat(this.getUser().getAssignedOrganizationIds()))
                                
                                localStorageService.set('userOrganizationIDs', [this.getUserOrgId()].concat(this.getUser().getAssignedOrganizationIds()));
                            }
                        } else if(this.getUser().getOrganizationType() === 'all') {
                            localStorageService.set('hasUserAllOrganizationIDs', true);
                        }
                    }
                } else {
                    localStorageService.set('userOrganizationIDs', []);
                }
            };

            this.getUserAllOrgIDs = function() {
                return localStorageService.get('userOrganizationIDs');
            };

            this.hasUserAllOrgIDs = function() {
                return localStorageService.get('hasUserAllOrganizationIDs');
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