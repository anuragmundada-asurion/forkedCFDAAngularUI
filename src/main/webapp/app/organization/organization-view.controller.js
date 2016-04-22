!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('OrganizationViewCtrl', ['$scope', '$state', '$stateParams', 'OrganizationFactory', 'FederalHierarchyService', 'FhConfigurationService',
        function ($scope, $state, $stateParams, OrganizationFactory, FederalHierarchyService, FhConfigurationService) {

            //OrganizationFactory.get({id: $stateParams.id}).$promise.then(function (data) {
            //
            //
            //    console.log('got this data... : ', data);
            //    $scope.oOrganization = data;
            //
            //
            //});


            FhConfigurationService.getFhConfiguration({id: $stateParams.id}, function(data){

                console.log('got this data from teh SERVICE, in the viewCtrl', data);

                $scope.oOrganization = data;
            });



        }
    ]);
}();