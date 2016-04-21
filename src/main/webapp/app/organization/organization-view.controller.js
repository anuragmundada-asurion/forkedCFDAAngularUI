!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('OrganizationViewCtrl', ['$scope', '$state', '$stateParams', 'OrganizationFactory', 'FederalHierarchyService',
        function ($scope, $state, $stateParams, OrganizationFactory, FederalHierarchyService) {

            OrganizationFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                //dummy data, will remove this later
                $scope.oOrganization = {
                    'name': 'GENERAL SERVICES ADMINISTRATION',
                    'acronym': 'GSA',
                    'agencyCode': '4700',
                    'agencyProgramCode': '39',
                    'programNumberLow': '5',
                    'programNumberHigh': '100',
                    'programNumberAuto': true
                };

                $scope.oOrganization = data;

                //add more fields
                FederalHierarchyService.getFederalHierarchyById(data.organizationId, false, false, function (d) {
                    $scope.oOrganization.name = d.name;
                    $scope.oOrganization.agencyProgramCode = d.cfdaCode;
                    $scope.oOrganization.acronym = 'Not available';
                    $scope.oOrganization.agencyCode = 'Not available';
                });


            });

        }
    ]);
}();