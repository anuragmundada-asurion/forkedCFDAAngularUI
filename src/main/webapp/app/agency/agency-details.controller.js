(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('AgencyDetailsController', ['$scope', '$state', '$stateParams', 'appConstants',
                      'ApiService', 'Dictionary',
            function($scope, $state, $stateParams, appConstants, ApiService, Dictionary) {
                $scope.regionalAgencyId = $stateParams.id;
                $scope.action = $stateParams.action; //edit/review/create
                $scope.actionProper; //used on the header of the page

                if($scope.action === 'create'){
                    $scope.actionProper = "New";
                }else if($scope.action === 'review') {
                    $scope.actionProper = "Details of ";
                } else if($scope.action === 'edit') {
                    $scope.actionProper = 'Edit';
                }
                $scope.agency = null;
                $scope.division = null;
                $scope.state = null;
                $scope.country = null;
                $scope.choices = {};
                $scope.choices.agencies = [
                    { element_id : 0, value:"General Services Administration" },
                    { element_id : 1, parent_element_id:0, value:"General Services Administration" },
                    { element_id : 2, parent_element_id:0, value:"EDS Location"},
                    { element_id : 3, value: "Department of Energy" },
                    { element_id : 4, parent_element_id: 3, value:"Department of Energy" },
                    { element_id : 5, parent_element_id: 3, value:"Department of Fossil Energy"}
                ];

                   var DICTIONARIES = [
                                     'states',
                                     'countries',
                                     'regional_office_division'
                                   ];


                Dictionary.toDropdown({ ids: DICTIONARIES.join(',') }).$promise.then(function(data){
                                             angular.extend($scope.choices, data);
                });

                //Get the Agency details if reviewing or editing.
                if($scope.action === 'edit' || $scope.action === 'review') {

                    var oApiParam = {
                         apiName: 'regionalAgencyEntity',
                         apiSuffix: "/" + $scope.regionalAgencyId,
                         oParams: {},
                         oData: {},
                         method: 'GET'
                    };

                    //call api and get results
                         $scope.promise = ApiService.call(oApiParam).then(
                             function(data) {
                                 var regionalAgency = {};

                                 $scope.oRegionalAgency = data;
                             },
                             function(error){

                         });

                }




                /**
                    Update or create a regional agency office
                **/
                $scope.updateRegionalAgency = function () {
                    var sMethod = "POST";
                    var sUrlSuffix = "";
                    var oData = {
                        agency: $scope.oRegionalAgency.agency,
                        division: $scope.oRegionalAgency.division,
                        branch: $scope.oRegionalAgency.branch,
                        subbranch: $scope.oRegionalAgency.subbranch,
                        region: $scope.oRegionalAgency.region,
                        phone: $scope.oRegionalAgency.phone,
                        address: $scope.oRegionalAgency.address,
                        city: $scope.oRegionalAgency.city,
                        state: $scope.oRegionalAgency.state,
                        zip: $scope.oRegionalAgency.zip,
                        id: $scope.oRegionalAgency.id,
                        addressId: $scope.oRegionalAgency.addressId,
                    };

                    if($scope.action === 'update') {
                        oData.id = $scope.oRegionalAgency.id;
                        oData.addressId = $scope.oRegionalAgency.addressId;
                        sMethod = "PUT";
                        sUrlSuffix = "/" + $scope.regionalAgencyId;
                    }


                    var oApiParam = {
                         apiName: 'regionalAgencyEntity',
                         apiSuffix: sUrlSuffix,
                         oParams: oData,
                         oData: oData,
                         method: sMethod
                    };

                    //call api and get results
                     $scope.promise = ApiService.call(oApiParam).then(
                         function(data) {
                            $scope.flash = {
                                 type: 'success',
                                 message: "Regional Agency Office successfully " + ($scope.action==='create')? "created.": "updated."
                             };

                            //go to list page after 2 seconds
                            $timeout(function() {
                                $state.go('regionalAgency');
                            }, 2000);

                         },
                         function(error){
                         $scope.flash = {
                           type: 'error',
                           message: "There was a problem " + (($scope.action==='create')? "creating": "updating") + " the Regional Agency Office."
                         };



                     });

                };

                $scope.deleteRegionalAgency = function () {
                    var oApiParam = {
                         apiName: 'regionalAgencyEntity',
                         apiSuffix: "/" + $scope.regionalAgencyId,
                         oParams: {},
                         oData: {},
                         method: 'DELETE'
                    };

                    //call api and get results
                     $scope.promise = ApiService.call(oApiParam).then(
                         function(data) {
                            $scope.flash = {
                                 type: 'success',
                                 message: "Regional Agency Office successfully deleted."
                             };

                             //go to list page after 2 seconds
                             $timeout(function() {
                                 $state.go('regionalAgency');
                             }, 2000);

                         },
                         function(error){
                         $scope.flash = {
                           type: 'error',
                           message: "There was a problem deleting the Regional Agency Office."
                         };

                     });
                };


            }
    ]);

    myApp.directive('ngConfirmClick', [
            function(){
                return {
                    link: function (scope, element, attr) {
                        var msg = attr.ngConfirmClick || "Are you sure?";
                        var clickAction = attr.confirmedClick;
                        element.bind('click',function (event) {

                            if ( window.confirm(msg) ) {
                                scope.$eval(clickAction)
                            }
                        });
                    }
                };
        }])
})();