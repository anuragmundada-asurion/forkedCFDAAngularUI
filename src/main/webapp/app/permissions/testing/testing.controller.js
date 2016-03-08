!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.run(['UserService', function(UserService) {
        var iamUser = {
            "token": {
                "gsaRAC": [
                    "GSA_CFDA_R_agency_submitter"
                ]
            }
        };
        UserService.changeUser(iamUser);
    }]);

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
                "token": {
                    "gsaRAC": [
                        $scope.roleChange
                    ]
                }
            };
            UserService.changeUser(user);
            ngDialog.close();
            $state.reload();
        };
    }]);
}();