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

        $(".sign").bind('keydown', function(event) {
            if(event.keyCode === 13){
                $scope.signInAsPopup();
            }
        });

        $scope.changeRole = function() {
            var user = {
                "roles": [
                    $scope.roleChange
                ],
                'fullName': $scope.roleChange,
                'username': $scope.roleChange,
                'orgId': '100011942'
            };
            Cookies.set('Rei-Sign-In-As', $scope.roleChange);
            UserService.changeUser(user);
            ngDialog.close();
            $state.reload();
        };
    }]);
}();