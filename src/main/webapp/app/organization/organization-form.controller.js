(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$window', 'RegionalOfficeFactory', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog', 'FhConfigurationService',
        function ($scope, $state, $stateParams, $timeout, $window, RegionalOfficeFactory, Dictionary, FederalHierarchyService, UserService, ngDialog, FhConfigurationService) {

            console.log("hello from Organization Form Ctrl ");

            angular.element(document).ready(function () {
                $(".ui.dropdown").dropdown();
            });


            $scope.id = $stateParams.id;
            FhConfigurationService.getFhConfiguration({id: $stateParams.id}, function (data) {
                //console.log('form ctrl!   got data from fhConfigService', data);
                $scope.oOrganization = data;
            });


        }]);
})();
