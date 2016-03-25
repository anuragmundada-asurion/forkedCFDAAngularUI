(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('RegionalOfficeFormCtrl', ['$scope', '$state', '$stateParams', '$timeout', 'RegionalOfficeFactory', 'Dictionary', 'FederalHierarchyService', 'UserService', 'ngDialog',
        function($scope, $state, $stateParams, $timeout, RegionalOfficeFactory, Dictionary, FederalHierarchyService, UserService, ngDialog) {
            $scope.dictionary = {};
            $scope.formHolder = {
                aAgency: [],
                oDivision: null,
                oState: null,
                oCountry: null
            };
            $scope.action = ($state.current['name'] === 'addRegionalOffice') ? 'create' : 'edit';

            /**
             * loading dictionaries (Country, State, Division)
             * @returns Void
             */
            $scope.loadDictionaries = function() {
                var aDictionay = [ 'regional_office_division', 'states' , 'countries' ];
                Dictionary.toDropdown({ ids: aDictionay.join(',') }).$promise.then(function(data){
                    $scope.dictionary.aDivision = $scope.dropdownSingleDataStructure(data.regional_office_division, 'element_id', $scope.oRegionalOffice.division)
                    $scope.dictionary.aState = $scope.dropdownSingleDataStructure(data.states, 'element_id', $scope.oRegionalOffice.address.state);
                    $scope.dictionary.aCountry = $scope.dropdownSingleDataStructure(data.countries, 'element_id', $scope.oRegionalOffice.address.country);
                });
            };

            //getting/creating the oRegionalOffice object
            if($scope.action === 'create') { // Create Program
                $scope.oRegionalOffice = new RegionalOfficeFactory();
                $scope.oRegionalOffice.address = {};

                //load dictionaries
                $scope.loadDictionaries();
            } else {
                RegionalOfficeFactory.get({id: $stateParams.id}).$promise.then(function(data){
                    $scope.oRegionalOffice = data;

                    //load dictionaries with preselected values (Preselected values must be loaded first)
                    $scope.loadDictionaries();
                });
            }

            //Loading Federal Hierarchy
            FederalHierarchyService.getFederalHierarchyById(UserService.getUserOrgId(), true, true, function(oData){
                $scope.dictionary.aAgency = [FederalHierarchyService.dropdownDataStructure(oData, [{ elementId: $scope.oRegionalOffice.agencyId }])];
            });

            /**
             * Create or Edit Program
             * @returns void
             */
            $scope.saveRegionalOffice = function() {
                if($scope.prepareDataStructure($scope.formHolder.aAgency, 'elementId') === false || !$scope.oRegionalOffice.phone){
                    $scope.flash = {
                        type: "error",
                        message: "Please provide all required fields before submitting the form."
                    };

                    return false;
                } else {
                    $scope.oRegionalOffice.agencyId = $scope.prepareDataStructure($scope.formHolder.aAgency, 'elementId');
                    $scope.oRegionalOffice.division = $scope.prepareDataStructure($scope.formHolder.oDivision, 'element_id');
                    $scope.oRegionalOffice.address.country = $scope.prepareDataStructure($scope.formHolder.oCountry, 'element_id');
                    $scope.oRegionalOffice.address.state = $scope.prepareDataStructure($scope.formHolder.oState, 'element_id');

                    $scope.oRegionalOffice[($scope.action === 'create') ? '$save' : '$update'](($scope.action === 'create') ? '' : ({id: $scope.oRegionalOffice.id})).then(function(data) {
                        $scope.flash = {
                            type: "success",
                            message: "The Regional Agency Office has been saved successfully !"
                        };
                    });
                }
            };

            /**
             * return first element in the array (for Dropdown selected values)
             * @param Array aData
             * @param String element
             * @returns String
             */
            $scope.prepareDataStructure = function(aData, element) {
                if(aData.length > 0) {
                    if(aData[0].hasOwnProperty(element)) {
                        return aData[0][element];
                    }
                }

                return false;
            };

            /**
             * structure data into dropdown single mode
             * @param Array aData
             * @param String selectedId
             * @returns Array
             */
            $scope.dropdownSingleDataStructure = function(aData, element, selectedId) {
                if(selectedId !== null && selectedId !== '' && element !== null && element !== '') {
                    angular.forEach(aData, function(item, index){
                        if(aData[index].hasOwnProperty(element) && aData[index][element] === selectedId) {
                            aData[index].ticked = true;
                        }
                    });
                }

                return aData;
            };

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
    }]);
})();
