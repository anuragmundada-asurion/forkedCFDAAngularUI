(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$window', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog', 'FhConfigurationService',
        function ($scope, $state, $stateParams, $timeout, $window, Dictionary, FederalHierarchyService, UserService, ngDialog, FhConfigurationService) {

            console.log("hello from form controller for hi");
        }]);
})();
