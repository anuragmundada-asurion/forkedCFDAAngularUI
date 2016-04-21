!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('OrganizationViewCtrl', ['$scope', '$state', '$stateParams', 'OrganizationFactory', 'FederalHierarchyService',
        function ($scope, $state, $stateParams, OrganizationFactory, FederalHierarchyService) {

            OrganizationFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                console.log('one org data: ', data);
                $scope.oOrganization = data;


                FederalHierarchyService.getFederalHierarchyById(data.organizationId, false, false, function (d) {
                    $scope.oOrganization.name = d.name;
                });






            });

        }
    ]);
}();