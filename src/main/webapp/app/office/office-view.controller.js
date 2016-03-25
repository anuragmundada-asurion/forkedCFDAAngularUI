!function() {
    'use strict';

    var myApp = angular.module('app');

    myApp.controller('RegionalOfficeViewCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'RegionalOfficeFactory', 'Dictionary', 'ngDialog',
        function($scope, $state, $stateParams, $timeout, RegionalOfficeFactory, Dictionary, ngDialog) {
            
            RegionalOfficeFactory.get({id: $stateParams.id}).$promise.then(function(data){
                $scope.oRegionalOffice = data;

                var aDictionay = [ 'regional_office_division', 'states' ];
                Dictionary.toDropdown({ ids: aDictionay.join(',') }).$promise.then(function(data){
                    angular.forEach(data.regional_office_division, function(oItem){
                        if(oItem.element_id === $scope.oRegionalOffice.division) {
                            $scope.oDivision = oItem;
                            return;
                        }
                    });
                });
            });

            /**
             * delete regional office
             * @returns void
             */
            $scope.deleteRegionalOffice = function(){
                if(confirm("Are you sure you want to delete this Regional agency office?")) {
                    $scope.oRegionalOffice.$delete({id: $scope.oRegionalOffice.id}).then(function(data){
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-success" role="alert">'+
                                        '<div class="usa-alert-body">'+
                                          '<p class="usa-alert-text">This Regional agency office has been successfully deleted.</p>'+
                                        '</div>'+
                                      '</div>',
                            plain: true,
                            closeByEscape: true,
                            showClose: true
                        });

                        //go to list page after 2 seconds
                        $timeout(function() {
                            ngDialog.closeAll();
                            $state.go('regionalOfficeList');
                        }, 3000);
                    }, 
                    function(error){
                        ngDialog.open({
                            template: '<div class="usa-alert usa-alert-error" role="alert">'+
                                        '<div class="usa-alert-body">'+
                                          '<h3 class="usa-alert-heading">Error Status</h3>'+
                                          '<p class="usa-alert-text">An error has occurred, please try again!</p>'+
                                        '</div>'+
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