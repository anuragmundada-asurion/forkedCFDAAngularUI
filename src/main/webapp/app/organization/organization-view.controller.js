!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('OrganizationViewCtrl', ['$scope', '$stateParams', 'FhConfigurationService',
        function ($scope, $stateParams, FhConfigurationService) {

            $scope.id = $stateParams.id;
            //call on service to get the fully processed data, as we expect it
            FhConfigurationService.getFhConfiguration({id: $scope.id}, function (data) {
                $scope.oOrganization = data;
                //console.log("organization view ctrl: got data: ", data);
            });


        }
    ]);
}();