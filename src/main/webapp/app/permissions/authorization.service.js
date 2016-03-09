!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('AuthorizationService', ['UserService', function(UserService) {
        this.authorize = function(requiredPermissions) {
            var userPermissions = UserService.getUserPermissions();

            var hasPermission = false;
            if (requiredPermissions && requiredPermissions.length) {
                requiredPermissions.every(function(requiredPermission) {
                    if (userPermissions.indexOf(requiredPermission) !== -1) {
                        hasPermission = true;
                        return false;
                    }

                    return true;
                });
            }

            return hasPermission;
        };
    }]);
}();