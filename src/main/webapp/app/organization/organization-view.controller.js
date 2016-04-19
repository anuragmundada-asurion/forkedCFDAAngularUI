!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('OrganizationViewCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'RegionalOfficeFactory', 'Dictionary', 'ngDialog',
        function ($scope, $state, $stateParams, $timeout, RegionalOfficeFactory, Dictionary, ngDialog) {


            console.log("hello from the view controller of organization");
            $scope.organization = true;


        }
    ]);
}();