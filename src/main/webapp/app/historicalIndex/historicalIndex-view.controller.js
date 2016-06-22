!function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('HistoricalIndexViewCtrl', ['$scope', '$stateParams', '$timeout', '$q', 'HistoricalIndexFactory', 'ProgramFactory',
        function ($scope, $stateParams, $timeout, $q, HistoricalIndexFactory, ProgramFactory) {

            //hard coded dictionary for now, may change later
            var labels = {
                agency: "Agency Changed",
                unarchive: "Reinstated",
                title: "Title Changed",
                archived: "Archived",
                program_number: "Number Changed",
                publish: "Published"
            };

            var promises = [];
            //make sure to pass promise objects,
            promises.push(HistoricalIndexFactory.get({id: $stateParams.hid}).$promise);
            promises.push(ProgramFactory.get({id: $stateParams.pid}).$promise);
            //finish all the promises and then run this function
            $q.all(promises).then(function (promisesData) {
                $scope.oHistoricalIndex = promisesData[0];
                $scope.oHistoricalIndex.programTitle = promisesData[1].title;

                $scope.oHistoricalIndex.reason = "mock reason... ";
                $scope.oHistoricalIndex.actionType = labels[$scope.oHistoricalIndex.actionType];
                $scope.oHistoricalIndex.pid = $stateParams.pid;
            });


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

        }
    ]);
}();