(function(){
    "use strict";

     var myApp = angular.module('app');
     myApp.controller('RegionalOfficeListController', ['$scope', 'appConstants', 'ApiService', 'Dictionary', 'FederalHierarchyService',
        function($scope, appConstants, ApiService, Dictionary, FederalHierarchyService) {
            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers= appConstants.PAGE_ITEM_NUMBERS;
            $scope.dictionary = {};
            $scope.filter = {
                aDivision:[],
                aAgency: []
            };
            $scope.previousState = null;
            var aDictionay = [ 'regional_office_division', 'states' ];

            //FIXME: Hardcode GSA Organization ID to pull 
            FederalHierarchyService.getFederalHierarchyById('9eb645ae12f3ff6f0eaa94b8ee10d7c2', true, true, function(oData){
                $scope.dictionary.aAgency = [$scope.dropdownDataStructure(oData, [])];
                console.log($scope.dictionary.aAgency);
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
                    console.log(tableState.search.predicateObject)
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
             * 
             * @param Object oData
             * @param Array aSelectedData
             * @param boolean isGrouped
             * @returns array
             */
            $scope.dropdownDataStructure = function(oData, aSelectedData) {
                var oResults = {}, aSelectedIDs = [];
                var oRow = oData;

                //add attribute
                oRow.selected = false;

                //delete unsued attribute
                delete oRow._links;
                delete oRow.parentElementId;

                //get all selected item ids
                angular.forEach(aSelectedData, function(item){
                    aSelectedIDs.push(item.elementId);
                });

                if(oData.hasOwnProperty("hierarchy")) {
                    angular.forEach(oData.hierarchy, function(oItem){
                        angular.extend(oResults, $scope.dropdownDataStructure(oItem, aSelectedData));
                    });

                    angular.extend(oResults, oRow);
                } else {
                    angular.extend(oResults, oRow);
                }

                return oResults;
            };
            
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

                        //delete treated object
                        //delete advancedSearchData[element];
                    }
                });

                return oResult;
            };

//            $scope.dropdownDataStructure = function(oData, aSelectedData) {
//                var oResults = {}, aSelectedIDs = [];
//                var oRow = oData;
//
//                //delete unsued attribute
//                delete oRow._links;
//                delete oRow.parentElementId;
//                delete oRow.elementId;
//                delete oRow.id;
//                delete oRow.marked;
//
//                //add attribute
//                oRow.checked = false;
//                oRow.open = true;
//                oRow.text = oRow.name;
//                oRow.value = oRow.name;
//
//                //get all selected item ids
//                angular.forEach(aSelectedData, function(item){
//                    aSelectedIDs.push(item.elementId);
//                });
//
//                if(oData.hasOwnProperty("hierarchy")) {
//                    var aSubHierarchy = oData.hierarchy;
//                    delete oRow.hierarchy;
//
//                    oRow.children = aSubHierarchy;
//
//                    angular.forEach(aSubHierarchy, function(oItem){
//                        angular.extend(oResults, $scope.dropdownDataStructure(oItem, aSelectedData));
//                    });
//
//                    angular.extend(oResults, oRow);
//                } else {
//                    angular.extend(oResults, oRow);
//                }
//
//                return oResults;
//            };
    }]);
})();
