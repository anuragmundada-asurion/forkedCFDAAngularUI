!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('TestingController', ['ngDialog', '$scope', 'UserService', '$state', function(ngDialog, $scope, UserService, $state) {
        $scope.roleChange = '';

        $scope.signInAsPopup = function() {
            ngDialog.open({
                template: 'permissions/testing/signInAs.tpl.html',
                className: 'ngdialog-theme-default'
            });
        };

        $scope.changeRole = function() {
            var user = {
                "gsaRAC": [
                    $scope.roleChange
                ],
                'tokenId': $scope.roleChange
            };
            UserService.changeUser(user);
            ngDialog.close();
            $state.reload();
        };
    }]);
}();