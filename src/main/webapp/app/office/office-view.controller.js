!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('RegionalOfficeViewCtrl', ['$scope', '$stateParams', 'RegionalOfficeFactory',
        function($scope, $stateParams, RegionalOfficeFactory) {
            RegionalOfficeFactory.get({id: $stateParams.id}).$promise.then(function(data){
                $scope.oRegionalOffice = data;
            });
        }
    ]);
}();