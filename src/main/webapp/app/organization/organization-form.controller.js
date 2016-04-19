(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('OrganizationFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$window', 'RegionalOfficeFactory', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog',
        function($scope, $state, $stateParams, $timeout, $window, RegionalOfficeFactory, Dictionary, FederalHierarchyService, UserService, ngDialog) {

            console.log("hello from Organization Form Ctrl ");
    }]);
})();
