!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('RegionalOfficeViewCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'RegionalOfficeFactory', 'Dictionary', 'ngDialog',
        function ($scope, $state, $stateParams, $timeout, RegionalOfficeFactory, Dictionary, ngDialog) {


            console.log("hello from the view controller");
            $scope.oRegionalOffice = true;


        }
    ]);
}();