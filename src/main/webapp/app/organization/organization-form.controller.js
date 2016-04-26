(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$window', 'RegionalOfficeFactory', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog', 'FhConfigurationService',
        function ($scope, $state, $stateParams, $timeout, $window, RegionalOfficeFactory, Dictionary, FederalHierarchyService, UserService, ngDialog, FhConfigurationService) {


            angular.element(document).ready(function () {
                $(".ui.dropdown").dropdown();
            });

            $scope.id = $stateParams.id;
            FhConfigurationService.getFhConfiguration({id: $stateParams.id}, function (data) {
                $scope.oOrganization = data;
                //console.log("called be, got this configuration:", data);
            });



            //$scope.$watch('oOrganization.programNumberAuto', function () {
            //    console.log("oOrganization.programNumberAuto changeed!! ", $scope.oOrganization.programNumberAuto);
            //});

            /**
             * Create or Edit Program
             * @returns void
             */
            $scope.saveFhConfiguration = function () {
                //empty message error
                $scope.flash = {};


                if (($scope.oOrganization.programNumberHigh === undefined ) || ($scope.oOrganization.programNumberLow === undefined ) || ($scope.oOrganization.programNumberAuto === undefined )) {
                    $scope.flash = {
                        type: "error",
                        message: "Please provide all required fields before submitting the form."
                    };
                    //scroll up in order for user to see the error message
                    $window.scrollTo(0, 0);
                } else {
                    //console.log("about to save config", $scope.oOrganization);
                    $scope.oOrganization['$update']({id: $stateParams.id}).then(function (data) {
                        //show dialog
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-success" role="alert">' +
                            '<div class="usa-alert-body">' +
                            '<p class="usa-alert-text">The CFDA Number Configuration has been saved successfully !</p>' +
                            '</div>' +
                            '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });

                        //go to list page after 2 seconds
                        $timeout(function () {
                            ngDialog.closeAll();
                            $state.go('viewOrganization', {id: $scope.id});
                        }, 3000);
                    });
                }
            };


        }]);
})();
