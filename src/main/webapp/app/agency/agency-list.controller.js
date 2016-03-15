(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('AgencyListController', ['$scope', '$state', '$stateParams', 'appConstants',
                      'ApiService', 'Dictionary',
            function($scope, $state, $stateParams, appConstants, ApiService, Dictionary) {
                 $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
                 $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;
                 $scope.searchDivision = null;
                 $scope.searchAgency = null;
                 $scope.choices = {};
                 $scope.choices.agencies = [
                     { element_id : 0, value:"General Services Administration" },
                     { element_id : 1, parent_element_id:0, value:"General Services Administration" },
                     { element_id : 2, parent_element_id:0, value:"EDS Location"},
                     { element_id : 3, value:"Department of Energy" },
                     { element_id : 4, parent_element_id: 3, value:"Department of Energy" },
                     { element_id : 5, parent_element_id: 3, value:"Department of Fossil Energy"}
                 ];
                var DICTIONARIES = [
                                     'regional_office_division',
                                     'states'
                                   ];

                Dictionary.toDropdown({ ids: DICTIONARIES.join(',') }).$promise.then(function(data){
                             angular.extend($scope.choices, data);
                         });

                //Group by filter for the Agency ui-select list.
                $scope.multiPickerGroupByFn = function(item) {
                     return !!item.parent ? item.parent.value : item.value;
                 }

                 /**
                  * Function loading agencies
                  * @param {type} tableState
                  * @returns Void
                  */
                $scope.loadAgencies= function(tableState) {
                     tableState = tableState || {
                         search: {},
                         pagination: {},
                         sort: {}
                     };

                    $scope.isLoading = true;

                    var oApiParam = {
                         apiName: 'regionalAgencyEntity',
                         apiSuffix: '',
                         oParams: {
                             limit: $scope.itemsByPage,
                             offset: tableState.pagination.start || 0,
                             includeCount: true
                         },
                         oData: {},
                         method: 'GET'
                    };

                     if (tableState.search.predicateObject) {
                         oApiParam.oParams['keyword'] = tableState.search.predicateObject.$;

                     }

                     if(tableState.sort.predicate) {
                         var isDescending = tableState.sort.reverse,
                             sortingProperty = tableState.sort.predicate;
                         oApiParam.oParams['sortBy'] = ( isDescending ? '-' : '' ) + sortingProperty;
                     }

                     //call api and get results
                     $scope.promise = ApiService.call(oApiParam).then(
                         function(data) {
                             var agencies = [];
                             agencies = data.results;
                             $scope.agencies = agencies;
                             $scope.isLoading = false;

                             tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                             tableState.pagination.totalItemCount = data.totalCount;
                             $scope.previousState = tableState;
                         },
                         function(error){


                     });
                };
    }]);

})();
