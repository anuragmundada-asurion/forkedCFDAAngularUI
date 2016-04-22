!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('OrganizationViewCtrl', ['$scope', '$state', '$stateParams', 'FhConfigurationService',
        function ($scope, $state, $stateParams, FhConfigurationService) {

            //call on service to get the fully processed data, as we expect it
            FhConfigurationService.getFhConfiguration({id: $stateParams.id}, function (data) {
                $scope.oOrganization = data;
            });


        }
    ]);
}();