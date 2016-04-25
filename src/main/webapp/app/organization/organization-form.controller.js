(function () {
    "use strict";

    var myApp = angular.module('app');
    myApp.controller('OrganizationFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', '$window', 'RegionalOfficeFactory', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog', 'FhConfigurationService',
        function ($scope, $state, $stateParams, $timeout, $window, RegionalOfficeFactory, Dictionary, FederalHierarchyService, UserService, ngDialog, FhConfigurationService) {

            console.log("hello from Organization Form Ctrl ");

            angular.element(document).ready(function () {
                $(".ui.dropdown").dropdown();
            });


            $scope.id = $stateParams.id;
            FhConfigurationService.getFhConfiguration({id: $stateParams.id}, function (data) {
                console.log('form ctrl!   got data from fhConfigService', data);
                $scope.oOrganization = data;
            });



            /**
             * Create or Edit Program
             * @returns void
             */
            $scope.saveFhConfiguration = function() {
                console.log("about to save config.., org obj: ", $scope.oOrganization);
                //empty message error
                $scope.flash = {};



                if(($scope.oOrganization.programNumberLow == 32 ) ||($scope.oOrganization.programNumberHigh === undefined ) || ($scope.oOrganization.programNumberLow === undefined ) || ($scope.oOrganization.programNumberAuto === undefined )){
                    console.log("error happend..");
                    $scope.flash = {
                        type: "error",
                        message: "Please provide all required fields before submitting the form."
                    };
                    //scroll up in order for user to see the error message
                    $window.scrollTo(0, 0);
                } else {

                    $scope.oOrganization['$update']({id: $stateParams.id}).then(function(data) {
                        console.log("successfully updated..", data);



                        //show dialog
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-success" role="alert">'+
                            '<div class="usa-alert-body">'+
                            '<p class="usa-alert-text">The CFDA Number Configuration has been saved successfully !</p>'+
                            '</div>'+
                            '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });

                        //go to list page after 2 seconds
                        $timeout(function() {
                            ngDialog.closeAll();
                            $state.go('organizationList');
                        }, 3000);
                    });
                }
            };





        }]);
})();
