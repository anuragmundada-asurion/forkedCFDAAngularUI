!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('AuthenticationService', ['UserService', function(UserService) {
        this.authenticate = function() {
            return (UserService.getUser() || Cookies.get('iplanetDirectoryPro')) ? true : false;
        };
    }]);
}();