!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('hasRole', ['UserService', function(UserService) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                var hasRole = false;
                var roles = UserService.getUser().getRoles();
                var rolesRequired = angular.fromJson(attributes['hasAccess']);
                if (!angular.isArray(rolesRequired)) {
                    rolesRequired = [rolesRequired];
                }

                rolesRequired.some(function(roleRequire) {
                    if (roles.indexOf(roleRequire) !== -1) {
                        hasRole = true;
                        return true;
                    }
                });

                if (hasRole) {
                    element.removeClass('hidden');
                } else {
                    element.addClass('hidden');
                }
            }
        }
    }]);
}();