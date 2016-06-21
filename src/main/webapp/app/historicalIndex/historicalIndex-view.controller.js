!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('HistoricalIndexViewCtrl', ['$scope', '$stateParams', 'HistoricalIndexFactory',
        function ($scope, $stateParams, HistoricalIndexFactory) {


            //hard coded dictionary for now, may change later
            var labels = {
                agency: "Agency Changed",
                unarchive: "Reinstated",
                title: "Title Changed",
                archived: "Archived",
                program_number: "Number Changed",
                publish: "Published"
            };

            HistoricalIndexFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                console.log("data: " , data);
                debugger;
                $scope.oHistoricalIndex = data;
                $scope.oHistoricalIndex.programTitle = "mock title... ";
                $scope.oHistoricalIndex.reason = "mock reason... ";
                $scope.oHistoricalIndex.actionType = labels[$scope.oHistoricalIndex.actionType];
            });


            $scope.deleteHistoricalIndex = function(){
                console.log("deleteHistoricalIndex called from view page");
            }



        }
    ]);
}();