!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('TestingController', ['ngDialog', '$scope', 'UserService', '$state', '$document', function(ngDialog, $scope, UserService, $state, $document) {
        $scope.roleChange = '';

        $scope.signInAsPopup = function() {
            ngDialog.open({
                template: 'permissions/testing/signInAs.tpl.html',
                className: 'ngdialog-theme-default'
            });
        };

        $scope.changeRole = function() {
            var user = {
                "roles": [
                    $scope.roleChange
                ],
                'fullName': $scope.roleChange,
                'username': $scope.roleChange,
                'orgId': '9eb645ae12f3ff6f0eaa94b8ee10d7c2'
            };
            Cookies.set('iplanetDirectoryPro', $scope.roleChange);
            UserService.changeUser(user);
            ngDialog.close();
            $state.reload();
        };
    }]);
}();