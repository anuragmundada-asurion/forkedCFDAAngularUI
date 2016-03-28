!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.run(['$rootScope', 'AuthorizationService', 'AuthenticationService', '$state', 'UserService',
        function($rootScope, AuthorizationService, AuthenticationService, $state, UserService) {
            if (Cookies.get("iplanetDirectoryPro")) {
                //  Toggle Loading Screen
                UserService.loadCLPUser();
            }

            $rootScope.$on('$stateChangeStart', function(event, stateConfig) {
                if (!window.skipInitialCheck && !UserService.isLoadingIamUser()) {
                    if (stateConfig['access']) {
                        var authenticated = AuthenticationService.authenticate();
                        if (!authenticated) {
                            event.preventDefault();
                            return $state.go('401');
                        } else {
                            var authorized = AuthorizationService.authorize(stateConfig['access']['requiredPermissions']);
                            if (!authorized) {
                                event.preventDefault();
                                return $state.go('403');
                            }
                        }
                    }
                }
            });
        }
    ]);
}();