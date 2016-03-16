!function() {
    'use strict';

    var myApp = angular.module('app');
    //  TODO Remove
    myApp.service('AuthenticationService', ['UserService', function(UserService) {
        this.authenticate = function() {
            return UserService.getUser() ? true : false;
        };
    }]);
}();