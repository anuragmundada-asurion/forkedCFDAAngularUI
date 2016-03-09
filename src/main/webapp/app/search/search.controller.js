!function() {
    'use strict';

    var app = angular.module('app');

    app.controller('ProgramSearchCtrl', ['$state', '$scope', '$stateParams', 'appConstants', 'SearchFactory', 'Dictionary',
        function($state, $scope, $stateParams, appConstants, SearchFactory, Dictionary) {
            $scope.globalSearchValue = $scope.globalSearchValue || $stateParams['keyword'] || SearchFactory.getSearchCriteria().keyword || '';
            $scope.itemsByPage = appConstants.DEFAULT_PAGE_ITEM_NUMBER;
            $scope.itemsByPageNumbers = appConstants.PAGE_ITEM_NUMBERS;

            //initialize advanced search fields criterias
            if($state.current['name'] === 'advancedSearch') {
                $scope.advancedSearch = SearchFactory.getSearchCriteria().advancedSearch;
                $scope.dictionary = {};

                //loading dictionaries
                //var aDictionaries = ['assistance_type', 'applicant_types', 'beneficiary_types', 'functional_codes', 'program_subject_terms'];
                var aDictionaries = ['assistance_type', 'applicant_types', 'beneficiary_types', 'functional_codes'];
                Dictionary.query({ ids: aDictionaries.join(',') }, function(data) {
                    //Assistance Types
                    $scope.dictionary.aAssistanceType = $scope.dropdownDataStructure(data.assistance_type, $scope.advancedSearch.aAssistanceType, true);

                    //Functional Code
                    $scope.dictionary.aFunctionalCode = $scope.dropdownDataStructure(data.functional_codes, $scope.advancedSearch.aFunctionalCode, true);

                    //Applicant Eligibility
                    $scope.dictionary.aApplicantEligibility = $scope.dropdownDataStructure(data.applicant_types, $scope.advancedSearch.aApplicantEligibility, false);

                    //Beneficiary Eligibility
                    $scope.dictionary.aBeneficiaryEligibility = $scope.dropdownDataStructure(data.beneficiary_types, $scope.advancedSearch.aBeneficiaryEligibility, false);

                    //Subject Terms
                    //$scope.dictionary.aSubjectTerm = $scope.dropdownDataStructure(data.program_subject_terms, $scope.advancedSearch.aSubjectTerm, true);
                });

                //function for setting the popup when opened to it's field input
                $scope.openDatepicker = function($event, openedInput) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.advancedSearch[openedInput] = true;
                };

                //setting for datepicker
                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                /**
                 * clear all advanced search form inputs
                 * @returns Void
                 */
                $scope.clearAdvancedSearchForm = function(){
                    //var aArray = ['aAssistanceType', 'aFunctionalCode', 'aApplicantEligibility', 'aBeneficiaryEligibility', 'aSubjectTerm'];
                    var aArray = ['aAssistanceType', 'aFunctionalCode', 'aApplicantEligibility', 'aBeneficiaryEligibility'];
                    $scope.advancedSearch = {};

                    angular.forEach(aArray, function(element){
                        angular.forEach($scope.dictionary[element], function(row, key){
                            if($scope.dictionary[element][key].hasOwnProperty('ticked')) {
                                delete $scope.dictionary[element][key].ticked;
                            }
                        });
                    });
                };
            }

            $scope.searchKeyUp = function(keyCode) {
                if (keyCode === 13) {
                    $scope.searchPrograms();
                }
            };

            /**
             * Perform Search
             * @returns Void
             */
            $scope.searchPrograms = function() {
                var advancedSearchCriteria = {};

                //store advanced search criteria into SearchFactory
                if($state.current['name'] === 'advancedSearch') {
                    advancedSearchCriteria = $scope.advancedSearch;
                }

                //set the search criteria into factory and store them
                SearchFactory.setSearchCriteria($scope.globalSearchValue, advancedSearchCriteria);
                $state.go('searchPrograms', {keyword: $scope.globalSearchValue}, {reload: true, inherit: false});
            };

            var lastTime;
            $scope.getSearchResults = function(tableState) {
                if (lastTime && ((new Date()).getTime() - lastTime) < 500) {
                    return;
                }
                lastTime = (new Date()).getTime();

                tableState = tableState || {
                    search: {},
                    pagination: {},
                    sort: {}
                };

                $scope.isLoading = true;

                var queryObj = {
                    keyword: $scope.globalSearchValue,
                    size: $scope.itemsByPage,
                    includeCount: true
                };

                //advanced seach
                var advancedSearch = $scope.prepareAdvancedSearchDataStructure(SearchFactory.getSearchCriteria().advancedSearch);
                //check if we have criteria set from advanced search
                if(!_.isEmpty(advancedSearch)) {
                    angular.extend(queryObj, {oFilterParam: JSON.stringify(advancedSearch)});
                    //console.log(queryObj);
                }

                if (tableState.pagination.start) {
                    queryObj["page"] = Math.ceil(tableState.pagination.start / queryObj.size);
                }

                if (tableState.sort.predicate) {
                    var isDescending = tableState.sort.reverse,
                        sortingProperty = tableState.sort.predicate;
                    queryObj.sortBy = ( isDescending ? '-' : '' ) + sortingProperty;
                }

                SearchFactory.search().get(queryObj, function(data) {
                    $scope.searchResults = data.results;
                    $scope.isLoading = false;
                    tableState.pagination.numberOfPages = Math.ceil(data.totalCount / $scope.itemsByPage);
                    tableState.pagination.totalItemCount = data.totalCount;
                });
            };

            /**
             * 
             * @param Array aData Source Data
             * @param Array aSelectedData selected data
             * @param Boolean isGrouped crrate nested categories
             * @returns Array
             */
            $scope.dropdownDataStructure = function(aData, aSelectedData, isGrouped) {
                var results = [];
                var selectedIDs = [];

                //get all selected item ids
                angular.forEach(aSelectedData, function(item){
                    selectedIDs.push(item.element_id);
                });

                if (isGrouped === true) { //generate nested dropdown list elements
                    angular.forEach(aData, function(oRow) {
                        var aElement = oRow.elements;

                        //make sure this item has children before creating nested categories
                        if(typeof aElement === 'object' && aElement !== null && aElement.length > 0) {
                            delete oRow.elements; //remove attribute that has array of element otherwise will trigger an error

                            oRow.msGroup = true;
                            results.push(oRow);

                            angular.forEach(aElement, function(oSubRow){
                                //pre-select item in dropdown
                                if($.inArray(oSubRow.element_id, selectedIDs) !== -1) {
                                    oSubRow.ticked = true;
                                }
                            
                                results.push(oSubRow);
                            });

                            results.push({msGroup: false});
                        } else {
                            //pre-select item in dropdown
                            if($.inArray(oRow.element_id, selectedIDs) !== -1) {
                                oRow.ticked = true;
                            }

                            results.push(oRow);
                        }
                    });
                } else { //generate single dropdown list elements
                    if(aSelectedData !== null) { 
                        //selected data
                        angular.forEach(aData, function(oRow) {
                            //pre-select item in dropdown
                            if($.inArray(oRow.element_id, selectedIDs) !== -1) {
                                oRow.ticked = true;
                            }

                            results.push(oRow);
                        });
                    } else { //return data
                        return aData;
                    }
                }

                return results;
            };

            /**
             * prepare advanced search data structure to send to search API as parameters
             * @param Object advancedSearchData
             * @returns Object
             */
            $scope.prepareAdvancedSearchDataStructure = function(advancedSearchData){
                var aArray = ['aAssistanceType', 'aFunctionalCode', 'aApplicantEligibility', 'aBeneficiaryEligibility'];
                var oResult = {};

                //loop through each filter
                angular.forEach(aArray, function(element){
//                    if(advancedSearchData.hasOwnProperty(element) && advancedSearchData[element].length > 0){
                    if(advancedSearchData.hasOwnProperty(element)){
                        angular.forEach(advancedSearchData[element], function(row){
                            if(oResult.hasOwnProperty(element)) {
                                oResult[element].push(row.element_id);
                            } else {
                                oResult[element] = [row.element_id];
                            }
                        });

                        //delete treated object
                        //delete advancedSearchData[element];
                    }
                });

                //include whatever left into oResult Object
                //angular.extend(oResult, advancedSearchData);
                if(advancedSearchData.hasOwnProperty('datePublishedStart')) {
                    oResult['datePublishedStart'] = advancedSearchData.datePublishedStart;
                }
                if(advancedSearchData.hasOwnProperty('datePublishedEnd')) {
                    oResult['datePublishedEnd'] = advancedSearchData.datePublishedEnd;
                }
                if(advancedSearchData.hasOwnProperty('executiveOrder12372')) {
                    oResult['executiveOrder12372'] = advancedSearchData.executiveOrder12372;
                }

                return oResult;
            };
        }
    ]);
}();