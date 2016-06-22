(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$q', 'HistoricalIndexFactory', 'ProgramFactory', 'ngDialog',
        function ($scope, $state, $stateParams, $timeout, $q, HistoricalIndexFactory, ProgramFactory,  ngDialog) {

            //hard coded dictionary for now, may change later
            $scope.labels = {
                agency: "Agency Changed",
                unarchive: "Reinstated",
                title: "Title Changed",
                archived: "Archived",
                program_number: "Number Changed",
                publish: "Published"
            };

            var promises = [];
            promises.push(HistoricalIndexFactory.get({id: $stateParams.hid}).$promise);
            promises.push(ProgramFactory.get({id: $stateParams.pid}).$promise);
            $q.all(promises).then(function(promisesData){
                $scope.oHistoricalIndex = promisesData[0];
                $scope.oHistoricalIndex.programTitle = promisesData[1].title;
            });


            $scope.years = _.range(1965, new Date().getFullYear() + 1);


            $scope.updateHistoricalIndex = function () {
                $scope.oHistoricalIndex.$update({id: $scope.oHistoricalIndex.id}).then(function (data) {
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-success" role="alert">' +
                            '<div class="usa-alert-body">' +
                            '<p class="usa-alert-text">The Historical Index Change has been saved successfully !</p>' +
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
