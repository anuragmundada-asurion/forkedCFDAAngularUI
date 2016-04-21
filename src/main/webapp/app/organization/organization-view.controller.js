!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('OrganizationViewCtrl', ['$scope', '$state', '$stateParams', 'OrganizationFactory', 'FederalHierarchyService',
        function ($scope, $state, $stateParams, OrganizationFactory, FederalHierarchyService) {

            OrganizationFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                console.log('one org data: ', data);
                $scope.oOrganization = {
                    'name': 'GENERAL SERVICES ADMINISTRATION',
                    'acronym': 'GSA',
                    'agencyCode': '4700',
                    'agencyProgramCode': '39',
                    'programNumberLow': '5',
                    'programNumberHigh': '100',
                    'programNumberAuto': true
                };

                $scope.oOrganization2 = data;
                console.log('$scope.oOrganization2: ', $scope.oOrganization2);

                FederalHierarchyService.getFederalHierarchyById(data.organizationId, false, false, function (d) {
                    console.log('$scope.oOrganization2: ', $scope.oOrganization2);
                });


            });

        }
    ]);
}();