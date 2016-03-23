!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('hasAccess', ['AuthenticationService', 'AuthorizationService', function(AuthenticationService, AuthorizationService) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                var permissionsRequired = angular.fromJson(attributes['hasAccess']);
                if (AuthorizationService.authorize(permissionsRequired)) {
                    element.removeClass('ng-hide');
                } else {
                    element.addClass('ng-hide');
                }
            }
        }
    }]);
}();