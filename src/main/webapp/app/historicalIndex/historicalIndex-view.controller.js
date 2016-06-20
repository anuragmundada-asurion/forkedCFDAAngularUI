!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('HistoricalIndexViewCtrl', ['$scope', '$stateParams', 'FhConfigurationService', 'ApiService',
        function ($scope, $stateParams, FhConfigurationService, ApiService) {

            //use api service to get data
            var oApiParam = {
                apiName: 'historicalChangeEntity',
                apiSuffix: '/' + $stateParams.id,
                method: 'GET'
            };
            ApiService.call(oApiParam).then(
                function (data) {
                    console.log("got this data from api service: ", data);
                    $scope.oHistoricalIndex = data;
                    $scope.oHistoricalIndex.programTitle = "mock title... ";
                    $scope.oHistoricalIndex.reason = "mock reason... ";
                },
                function (error) {
                    console.log("error happened from api service: ", error);
                }
            );
        }
    ]);
}();