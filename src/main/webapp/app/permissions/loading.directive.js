!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.directive('loadingModal', ['UserService', function(UserService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="loading-modal"><div class="loading-icon"></div></div>',
            link: function(scope, element) {
                scope.$watch(
                    function() {
                        return UserService.getUser();
                    },
                    function() {
                        if (!window.skipInitialCheck && !UserService.isLoadingIamUser()) {
                            element.addClass('hidden');
                        } else {
                            element.removeClass('hidden');
                        }
                    }
                );
            }
        }
    }]);
}();