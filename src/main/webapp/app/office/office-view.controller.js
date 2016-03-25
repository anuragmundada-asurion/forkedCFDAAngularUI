!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('RegionalOfficeViewCtrl', ['$scope', '$stateParams', 'RegionalOfficeFactory', 'FederalHierarchyService',
        function($scope, $stateParams, RegionalOfficeFactory, FederalHierarchyService) {
            $scope.officeId = $stateParams.id;

            function getFullName(oData) {
                var name = oData.name;
                if (oData.hasOwnProperty('hierarchy')) {
                    name += ' / ' + getFullName(oData['hierarchy'][0]);
                }

                return name;
            }

            RegionalOfficeFactory.get({id: $stateParams.id}).$promise.then(function(data){
                $scope.oRegionalOffice = data;

                FederalHierarchyService.getFederalHierarchyById($scope.oRegionalOffice.agencyId, true, false, function(oData){
                    $scope.oAgencyName = getFullName(oData);
                });
            });
        }
    ]);
}();