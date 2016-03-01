(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('AgencyListController', ['$scope', '$state', '$stateParams', 'appConstants', 'ApiService',
            function($scope, $state, $stateParams, appConstants, ApiService) {
                 $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
                 $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;


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
                         apiName: 'agencyList',
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
                             //cleanup and adjust strutre data
                            /* if($scope.programStatus === 'requests'){
                                 programs = data.results;
                             } else {*/
                                 angular.forEach(data.results, function (item) {
                                     angular.forEach(item, function (prop, key) {
                                         if (!prop._id)
                                             prop._id = key;
                                         agencies.push(prop);
                                     });
                                 });
                           /*  }*/

                             $scope.agencies = agencies;
                             $scope.isLoading = false;

                             tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                             tableState.pagination.totalItemCount = data.totalCount;
                             $scope.previousState = tableState;
                         },
                         function(error){

                     });
                 };

                 /**
                  * function for editing Agency
                  * @param Object Agency
                  * @param {type} section
                  * @returns Void
                  */
                 $scope.editAgency= function(agency, section) {
                     section = section || 'info';
                     $state.go('editAgency', {
                         id: agency._id,
                         section: section
                     });
                 };

            }]);

})();