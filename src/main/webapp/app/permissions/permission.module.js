!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.run(['$rootScope', 'AuthorizationService', 'AuthenticationService', '$state', function($rootScope, AuthorizationService, AuthenticationService, $state) {
        $rootScope.$on('$stateChangeStart', function(event, stateConfig){
            //if (!stateConfig['access']) {
            //    throw new Error('Invalid state: Access block missing');
            //    event.preventDefault();
            //    return $state.go('error');
            //}
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
        });
    }]);
}();