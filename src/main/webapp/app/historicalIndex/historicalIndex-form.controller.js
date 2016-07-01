(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('HistoricalIndexFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$q', 'HistoricalIndexFactory', 'ProgramFactory', 'ngDialog',
        function ($scope, $state, $stateParams, $timeout, $q, HistoricalIndexFactory, ProgramFactory, ngDialog) {

            //hard coded dictionary for now, may change later
            $scope.labels = {
                agency: "Agency Changed",
                unarchive: "Reinstated",
                title: "Title Changed",
                archived: "Archived",
                program_number: "Number Changed",
                publish: "Published"
            };

            $scope.isEdit = $state.current.name == "addHistoricalIndex" ? false : true;
            $scope.isLegacyRecord = false;

            var promises = [];
            if($scope.isEdit){
                promises.push(HistoricalIndexFactory.get({id: $stateParams.hid}).$promise);
                promises.push(ProgramFactory.get({id: $stateParams.pid}).$promise);
                $q.all(promises).then(function (promisesData) {
                    $scope.oHistoricalIndex = promisesData[0];
                    $scope.oHistoricalIndex.programTitle = promisesData[1].title;
                    //manual editing an automated index
                    if($scope.oHistoricalIndex.isManual=="0"){
                        $scope.oHistoricalIndex.isManual="2";
                    }
                    if($scope.oHistoricalIndex.statusCode && $scope.oHistoricalIndex.statusCode.length > 0){
                        $scope.isLegacyRecord = true;
                    }
                });
            }
            else{
                promises.push(ProgramFactory.get({id: $stateParams.pid}).$promise);
                $q.all(promises).then(function (promisesData) {
                    $scope.oHistoricalIndex = new HistoricalIndexFactory();
                    $scope.oHistoricalIndex.organizationId = promisesData[0].organizationId;
                    $scope.oHistoricalIndex.programTitle = promisesData[0].title;
                    $scope.oHistoricalIndex.programNumber = promisesData[0].programNumber;
                });
            }

            $scope.years = _.range(1965, new Date().getFullYear() + 1);
            $scope.form = {
                error : false
            };
            $scope.createHistoricalIndex = function () {
                var validSubmission = validateForm($scope.oHistoricalIndex);
                if(validSubmission){
                    $scope.form.error = false;
                    $scope.oHistoricalIndex.$save().then(function(data){
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-success" role="alert">' +
                            '<div class="usa-alert-body">' +
                            '<p class="usa-alert-text">The Historical Index Change has been created successfully !</p>' +
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
                    function(error){
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
                else {
                    $scope.form.error = true;
                }
            };

            $scope.updateHistoricalIndex = function () {
                var validSubmission = validateForm($scope.oHistoricalIndex);
                if(validSubmission){
                    $scope.form.error = false;
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
                }
                else {
                    $scope.form.error = true;
                }
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

            function validateForm(historicalIndexObj){
                return historicalIndexObj.fiscalYear && historicalIndexObj.fiscalYear != 0
                && historicalIndexObj.actionType && historicalIndexObj.actionType.length > 0
                && historicalIndexObj.changeDescription && historicalIndexObj.changeDescription.length > 0;
            }

        }]);
})();
