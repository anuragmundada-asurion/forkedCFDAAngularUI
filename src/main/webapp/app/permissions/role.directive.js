!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('hasRole', ['AuthorizationService', function(AuthorizationService) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                var rolesRequired = angular.fromJson(attributes['hasRole']);
                if (AuthorizationService.authorizeByRole(rolesRequired)) {
                    element.removeClass('hidden');
                } else {
                    element.addClass('hidden');
                }
            }
        }
    }]);
}();