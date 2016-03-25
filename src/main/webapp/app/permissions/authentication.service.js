!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('AuthenticationService', [function() {
        this.authenticate = function() {
            return Cookies.get('iplanetDirectoryPro') ? true : false;
        };
    }]);
}();