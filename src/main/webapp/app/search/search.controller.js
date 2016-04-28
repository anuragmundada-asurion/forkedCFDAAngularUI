!function () {
    'use strict';

    var app = angular.module('app');

    app.controller('ProgramSearchCtrl', ['$state', '$scope', '$stateParams', 'SearchFactory', 'Dictionary', 'DictionaryService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile', 'FederalHierarchyService', '$q',
        function ($state, $scope, $stateParams, SearchFactory, Dictionary, DictionaryService, DTOptionsBuilder, DTColumnBuilder, $compile, FederalHierarchyService, $q) {
            $scope.globalSearchValue = $scope.globalSearchValue || $stateParams['keyword'] || SearchFactory.getSearchCriteria().keyword || '';
            $scope.advancedSearch = SearchFactory.getSearchCriteria().advancedSearch;
            $scope.dictionary = {};

            //loading dictionary: assistance_type
            Dictionary.query({ids: 'assistance_type'}, function (data) {
                //Assistance Types
                $scope.dictionary.aAssistanceType = DictionaryService.istevenDropdownDataStructure(data.assistance_type, $scope.advancedSearch.aAssistanceType, true);
            });

            //remove custom search fields out of advanced search fields criteria
            if($state.current['name'] === 'advancedSearch' || $state.current['name'] === 'home' || ($stateParams.hasOwnProperty('removeCustomSearchFields') && $stateParams.removeCustomSearchFields)) {
                //remove pre-filtered Publication Listing (Coming from home "New in 2016" section)
                if($scope.advancedSearch.hasOwnProperty('publicationListingType')) {
                    delete $scope.advancedSearch.publicationListingType;
                }
            }

            //initialize advanced search fields criterias
            if ($state.current['name'] === 'advancedSearch' || $state.current['name'] === 'home' || $state.current['name'] === 'searchPrograms') {
                //loading dictionaries
                //var aDictionaries = ['assistance_type', 'applicant_types', 'beneficiary_types', 'functional_codes', 'program_subject_terms'];
                var aDictionaries = ['applicant_types', 'beneficiary_types', 'functional_codes', 'assistance_usage_types'];
                Dictionary.query({ids: aDictionaries.join(',')}, function (data) {
                    //Functional Code
                    $scope.dictionary.aFunctionalCode = DictionaryService.istevenDropdownDataStructure(data.functional_codes, $scope.advancedSearch.aFunctionalCode, true);

                    //Applicant Eligibility
                    $scope.dictionary.aApplicantEligibility = DictionaryService.istevenDropdownDataStructure(data.applicant_types, $scope.advancedSearch.aApplicantEligibility, false);

                    //Beneficiary Eligibility
                    $scope.dictionary.aBeneficiaryEligibility = DictionaryService.istevenDropdownDataStructure(data.beneficiary_types, $scope.advancedSearch.aBeneficiaryEligibility, false);

                    //Use of Assistance
                    $scope.dictionary.aAssistanceUsageType = DictionaryService.istevenDropdownDataStructure(data.assistance_usage_types, $scope.advancedSearch.aAssistanceUsageType, false);
                });

                //function for setting the popup when opened to it's field input
                $scope.openDatepicker = function ($event, openedInput) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    $scope.advancedSearch[openedInput] = true;
                };

                //setting for datepicker
                $scope.dateOptions = {
                    formatYear: 'yy',
                    showWeeks: false,
                    startingDay: 1
                };

                /**
                 * clear all advanced search form inputs
                 * @returns Void
                 */
                $scope.clearAdvancedSearchForm = function () {
                    var aArray = ['aAssistanceType', 'aFunctionalCode', 'aApplicantEligibility', 'aBeneficiaryEligibility', 'aAssistanceUsageType'];
                    $scope.advancedSearch = {};

                    $scope.dictionary = DictionaryService.istevenDropdownResetData($scope.dictionary, aArray);
                    //empty Search criteria (keyword & advanced search criterias) 
                    //when user go to other pages rather then search
                    SearchFactory.setSearchCriteria(null, {});

                    $scope.globalSearchValue = '';
                };
            }

            $scope.searchKeyUp = function (keyCode) {
                if (keyCode === 13) {
                    $scope.searchPrograms();
                }
            };

            /**
             * Perform Search
             * @returns Void
             */
            $scope.searchPrograms = function () {
                //set the search criteria into factory and store them
                SearchFactory.setSearchCriteria($scope.globalSearchValue, $scope.advancedSearch);
                $state.go('searchPrograms', {keyword: $scope.globalSearchValue}, {reload: true, inherit: false});
            };

            var lastTime;
            $scope.getSearchResults = function (data, callback, settings) {
                if (lastTime && ((new Date()).getTime() - lastTime) < 500) {
                    return;
                }
                lastTime = (new Date()).getTime();
                var queryObj = {
                    keyword: $scope.globalSearchValue,
                    size: data['length'] || 10,
                    includeCount: true
                };

                //advanced seach
                var advancedSearch = $scope.prepareAdvancedSearchDataStructure(SearchFactory.getSearchCriteria().advancedSearch);
                //check if we have criteria set from advanced search
                if (!_.isEmpty(advancedSearch)) {
                    angular.extend(queryObj, {oFilterParam: JSON.stringify(advancedSearch)});
                    //console.log(queryObj);
                }

                if (data['start']) {
                    queryObj["page"] = Math.ceil(data['start'] / queryObj.size);
                }

                if (data['order']) {
                    var order = data['order'][0];
                    var columnName = data['columns'][order['column']]['data'];
                    if (columnName) {
                        queryObj['sortBy'] = ( angular.equals(order['dir'], 'asc') ? '' : '-' ) + columnName;
                    }
                }

                SearchFactory.search().get(queryObj, function (d) {
                    var results = d.results;
                    var promises = [];
                    var tableData = [];
                    angular.forEach(results, function (r) {
                        var row = {
                            'programNumber': r['programNumber'],
                            'title': {
                                'id': r['id'],
                                'value': r['title']
                            },
                            'organization': r['organizationId'],
                            'assistanceTypes': r['assistanceTypes']
                        };
                        promises.push(FederalHierarchyService.getFederalHierarchyById(r['organizationId'], true, false, function (data) {
                            row['organization'] = FederalHierarchyService.getFullNameFederalHierarchy(data);
                        }, function () {
                            row['organization'] = 'Organization Not Found';
                        }));
                        tableData.push(row);
                    });
                    $q.all(promises).then(function () {
                        callback({
                            "draw": parseInt(data['draw']) + 1,
                            "recordsTotal": d['totalCount'],
                            "recordsFiltered": d['totalCount'],
                            "data": tableData
                        });
                    });
                });
            };

            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('initComplete', function(settings, json){
                    // Initialize semantic ui dropdown
                    $(".dataTables_length select").addClass("ui compact dropdown").dropdown();                       
                    // Remove select to fix dropdown  double click bug
                    $(".dataTables_length select").remove();
                    // Append info text for easier theming
                    $(".dataTables_info").appendTo(".dataTables_length label");
                    $(".dataTables_info").contents().unwrap();
                })
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('searching', false)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDataProp('data')
                .withDOM('<"top ui fixed container"r> <"ui fixed container"t> <"bottom background gray" <"ui fixed container" <"ui grid" <"two column row" <"column"li> <"column"p> > > > > <"clear">')
                .withOption('rowCallback', function(row) {
                    $compile(row)($scope);
                })
                .withOption('ajax', $scope.getSearchResults)
                .withLanguage({
                    'processing': '<div class="ui active small inline loader"></div> Loading',
                    'emptyTable': 'No Results Found',
                    'lengthMenu': 'Showing _MENU_ entries',
                    'info': ' of _TOTAL_ entries'
                });
            $scope.dtColumns = [
                DTColumnBuilder.newColumn('programNumber').withTitle('FAL #').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('title').withTitle('Title').withOption('defaultContent', '')
                    .withOption('render', function (data) {
                        return '<a ui-sref="viewProgram({id: \'' + data['id'] + '\'})">' + data['value'] + '</a>';
                    }),
                DTColumnBuilder.newColumn('organization').withTitle('Department/Sub-Tier Agency & Office').withOption('defaultContent', ''),
                DTColumnBuilder.newColumn('assistanceTypes').withTitle('Types of Assistance').withOption('defaultContent', '')
            ];

            /**
             * prepare advanced search data structure to send to search API as parameters
             * @param Object advancedSearchData
             * @returns Object
             */
            $scope.prepareAdvancedSearchDataStructure = function (advancedSearchData) {
                var aArray = ['aAssistanceType', 'aFunctionalCode', 'aApplicantEligibility', 'aBeneficiaryEligibility', 'aAssistanceUsageType'];
                var oResult = DictionaryService.istevenDropdownGetIds(advancedSearchData, aArray);

                //include whatever left into oResult Object
                if (advancedSearchData.hasOwnProperty('datePublishedStart')) {
                    oResult['datePublishedStart'] = advancedSearchData.datePublishedStart;
                }
                if (advancedSearchData.hasOwnProperty('datePublishedEnd')) {
                    oResult['datePublishedEnd'] = advancedSearchData.datePublishedEnd;
                }
                if (advancedSearchData.hasOwnProperty('executiveOrder12372')) {
                    oResult['executiveOrder12372'] = advancedSearchData.executiveOrder12372;
                }
                if (advancedSearchData.hasOwnProperty('recovery')) {
                    oResult['recovery'] = advancedSearchData.recovery;
                }
                if (advancedSearchData.hasOwnProperty('publicationListingType')) {
                    oResult['publicationListingType'] = advancedSearchData.publicationListingType;
                }
                return oResult;
            };
        }
    ]);
}();
