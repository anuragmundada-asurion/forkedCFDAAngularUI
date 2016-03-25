(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('RegionalOfficeListController', ['$scope', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService', 'UserService',
        function($scope, appConstants, ApiService, Dictionary, FederalHierarchyService, UserService) {
            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;
            $scope.dictionary = {};
            $scope.filter = {
                aDivision:[],
                aAgency: []
            };
            $scope.previousState = null;
            var aDictionay = [ 'regional_office_division', 'states' ];

            FederalHierarchyService.getFederalHierarchyById(UserService.getUserOrgId(), true, true, function(oData){
                $scope.dictionary.aAgency = [FederalHierarchyService.dropdownDataStructure(oData, [])];
            });

            Dictionary.toDropdown({ ids: aDictionay.join(',') }).$promise.then(function(data){
                $scope.dictionary.aDivision = data.regional_office_division;
                $scope.dictionary.aStates = data.states;
            });

            //Group by filter for the Agency ui-select list.
            $scope.multiPickerGroupByFn = function(item) {
                return !!item.parent ? item.parent.value : item.value;
            };

            /**
             * Function loading agencies
             * @param {type} tableState
             * @returns Void
             */
            $scope.loadAgencies = function(tableState) {
                tableState = tableState || {
                    search: {},
                    pagination: {},
                    sort: {}
                };

                $scope.isLoading = true;

                var oApiParam = {
                     apiName: 'regionalOfficeList',
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
                    oApiParam.oParams['keyword'] = tableState.search.predicateObject.keyword;
                }

                //apply agency custom search
                if($scope.filter.aAgency.length > 0 || $scope.filter.aDivision.length > 0) {
                     oApiParam.oParams['oFilterParam'] = $scope.prepareDataStructure($scope.filter);
                }

                if(tableState.sort.predicate) {
                    var isDescending = tableState.sort.reverse,
                        sortingProperty = tableState.sort.predicate;
                    oApiParam.oParams['sortBy'] = ( isDescending ? '-' : '' ) + sortingProperty;
                }

                 //call api and get results
                $scope.promise = ApiService.call(oApiParam).then(
                    function(data) {
                        $scope.aAgency = data.results;
                        $scope.isLoading = false;

                        tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                        tableState.pagination.totalItemCount = data.totalCount;
                        $scope.previousState = tableState;
                    },
                    function(error){

                });
            };

            //Automatically loadAgencies if Filter scope has changed
            $scope.$watch('filter', function() {
                $scope.loadAgencies($scope.previousState);
            }, true);

            /**
             * prepare  data structure to send to regionalOffices API as parameters
             * @param Object oData
             * @returns Object
             */
            $scope.prepareDataStructure = function(oData){
                var aArray = ['aDivision', 'aAgency'];
                var oResult = {};

                //loop through each filter
                angular.forEach(aArray, function(element){
                    if(oData.hasOwnProperty(element)){
                        angular.forEach(oData[element], function(row){
                            if(oResult.hasOwnProperty(element)) {
                                oResult[element].push((row.hasOwnProperty('elementId')) ? row.elementId : row.element_id);
                            } else {
                                oResult[element] = [(row.hasOwnProperty('elementId')) ? row.elementId : row.element_id];
                            }
                        });
                    }
                });

                return oResult;
            };
    }]);
})();
