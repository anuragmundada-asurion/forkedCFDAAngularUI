(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexFormCtrl', ['$scope', '$state', '$stateParams', 'ApiService', 'HistoricalIndexFactory', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog', 'FhConfigurationService',
        function ($scope, $state, $stateParams, ApiService, HistoricalIndexFactory, Dictionary, FederalHierarchyService, UserService, ngDialog, FhConfigurationService) {

            //hard coded dictionary for now, may change later
            var labels = {
                agency: "Agency Changed",
                unarchive: "Reinstated",
                title: "Title Changed",
                archived: "Archived",
                program_number: "Number Changed",
                publish: "Published"
            };


            ////use api service to get data
            //var oApiParam = {
            //    apiName: 'historicalChangeEntity',
            //    apiSuffix: '/' + $stateParams.id,
            //    method: 'GET'
            //};
            //ApiService.call(oApiParam).then(
            //    function (data) {
            //        console.log("got this data from api service: ", data);
            //        $scope.oHistoricalIndex = data;
            //        $scope.oHistoricalIndex.programTitle = "mock title... ";
            //        $scope.oHistoricalIndex.reason = "mock reason... ";
            //        $scope.oHistoricalIndex.actionType = labels[$scope.oHistoricalIndex.actionType];
            //    },
            //    function (error) {
            //        console.log("error happened from api service: ", error);
            //    }
            //);

            HistoricalIndexFactory.get({id: $stateParams.id}).$promise.then(function (data) {
                console.log("data: " , data);
                debugger;
                $scope.oHistoricalIndex = data;
                $scope.oHistoricalIndex.programTitle = "mock title... ";
                $scope.oHistoricalIndex.reason = "mock reason... ";
                $scope.oHistoricalIndex.actionType = labels[$scope.oHistoricalIndex.actionType];
            });




            $scope.years = _.range(1965, new Date().getFullYear());


            $scope.updateHistoricalIndex = function () {

                console.log("updateHistoricalIndex function called");
            };

            $scope.deleteHistoricalIndex = function () {
                if (confirm("Are you sure you want to delete this Historical Index Change?")) {
                    $scope.oHistoricalIndex.$delete({id: $scope.oHistoricalIndex.id}).then(function (data) {
                            ngDialog.open({
                                template: '<div class="usa-alert usa-alert-success" role="alert">' +
                                '<div class="usa-alert-body">' +
                                '<p class="usa-alert-text">This Historical Index Change has been successfully deleted.</p>' +
                                '</div>' +
                                '</div>',
                                plain: true,
                                closeByEscape: true,
                                showClose: true
                            });

                            //go to list page after 2 seconds
                            $timeout(function () {
                                ngDialog.closeAll();
                                $state.go('historicalIndex');
                            }, 3000);
                        },
                        function (error) {
                            ngDialog.open({
                                template: '<div class="usa-alert usa-alert-error" role="alert">' +
                                '<div class="usa-alert-body">' +
                                '<h3 class="usa-alert-heading">Error Status</h3>' +
                                '<p class="usa-alert-text">An error has occurred, please try again!</p>' +
                                '</div>' +
                                '</div>',
                                plain: true,
                                closeByEscape: true,
                                showClose: true
                            });
                        });
                }
            };

        }]);
})();
