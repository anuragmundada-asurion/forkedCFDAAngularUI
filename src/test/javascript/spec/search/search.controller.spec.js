'use strict';

describe('Unit Tests for Program Search Controller', function() {
    var $controller;
    var $rootScope;
    var testKeyword = "ASDF Test Search";
    var SearchFactory;

    beforeEach(inject(function(_$rootScope_, _$location_, _$controller_, _SearchFactory_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        SearchFactory = _SearchFactory_;
    }));

    describe('$scope.globalSearchValue', function() {
        it('should set the default value of globalSearchValue', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope });
            expect(scope.globalSearchValue).toBe('');
        });

        it('should set the value of globalSearchValue to what is present in rootScope', function() {
            var scope = {};
            SearchFactory.setSearchCriteria('Test Keyword');
            $controller('ProgramSearchCtrl', { $scope: scope });
            expect(scope.globalSearchValue).toBe('Test Keyword');
        });

        it('should set the value of globalSearchValue to what is present in stateParams', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope, $stateParams: { 'keyword': 'Test Keyword 2' } });
            expect(scope.globalSearchValue).toBe('Test Keyword 2');
        });
    });

    describe('$scope.searchKeyUp', function() {
        it('should instantiate searchKeyUp function', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope });
            expect(scope.searchKeyUp).toBeDefined();
        });

        it('should call searchPrograms when enter key code is passed', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope });
            scope.searchKeyUp(13);
        });

        it('should not call searchPrograms when any key code is passed that isnt enter', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope });
            scope.searchKeyUp(1);
            scope.searchKeyUp(10);
            scope.searchKeyUp(100);
        });
    });

    describe('$scope.searchPrograms', function() {
        it('should instantiate searchPrograms function', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope });
            expect(scope.searchPrograms).toBeDefined();
        });

        describe('$location.path', function() {
            var $state;
            beforeEach(inject(function(_$state_) {
                $state = _$state_;
            }));

            it('should change location path if globalSearchValue is passed', function() {
                var scope = $rootScope.$new();
                var rootScope = {};
                spyOn($state, 'go');
                $controller('ProgramSearchCtrl', { $rootScope: rootScope, $scope: scope, $state: $state });
                scope['globalSearchValue'] = testKeyword;
                SearchFactory.setSearchCriteria(testKeyword);
                scope.searchPrograms();
                expect($state.go).toHaveBeenCalled();
            });

            it('should not change location path if globalSearchValue is missing', function() {
                var scope = $rootScope.$new();
                spyOn($state, 'go');
                $controller('ProgramSearchCtrl', { $scope: scope, $state: $state });
                scope.searchPrograms();
                scope.$digest();
                expect($state.go).not.toHaveBeenCalledWith('/search');
            });

            it('should set globalSearchValue in rootScope to value in scope', function() {
                var scope = $rootScope.$new();
                spyOn($state, 'go');
                $controller('ProgramSearchCtrl', { $scope: scope, $state: $state });
                scope['globalSearchValue'] = testKeyword;
                scope.searchPrograms();
                scope.$digest();
            });
        })
    });
});

describe('$scope.getSearchResults', function() {
    var $controller;
    var testKeyword = "ASDF Test Search";
    var testResults = [ 'Result 1', 'Result 2' ];
    var testTotalCount = 100;
    var mockSearchResource;
    var appConstants;
    var $rootScope;
    var $state;

    beforeEach(function() {
        module('app');

        module(function($provide) {
            //simulating SearchFactory mock
            mockSearchResource = {
                keyword: '',
                advancedSearch: {
                    "aAssistanceType": [{
                      element_id: "0001001"
                    }],
                    "aFunctionalCode": [{
                      element_id: "0001003"
                    }],
                    "aApplicantEligibility": [{
                      element_id:"0001"
                    }],
                    "aBeneficiaryEligibility": [{
                      element_id:"1"
                    }],
                    "datePublishedStart": "2014-01-01T05:00:00.000Z",
                    "datePublishedEnd": "2016-03-02T05:00:00.000Z",
                    "executiveOrder12372": "yes"
                },
                getSearchCriteria: function() {
                    return { keyword: mockSearchResource.keyword, advancedSearch: mockSearchResource.advancedSearch };
                },
                setSearchCriteria: function(keyword, advancedSearch) {
                    mockSearchResource.keyword = keyword;
                    mockSearchResource.advancedSearch = advancedSearch;
                },
                search: function() {
                    return { 
                        get: function(queryObject, fnCallback) {
                            mockSearchResource.queryObject = queryObject;
                            fnCallback({
                                totalCount: testTotalCount,
                                results: testResults
                            });
                        }
                    };
                }
            };

            $provide.value('SearchFactory', mockSearchResource);
        });

        inject(function(_$rootScope_, _$controller_, _$state_, _appConstants_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            appConstants = _appConstants_;
            $state = _$state_;
        });
    });

    it('Should store advanced search criteria and fire prepare data structure', function(){
        var scope = {};
        var tableState = {
            search: {},
            pagination: {},
            sort: {}
        };
        $state.transitionTo('advancedSearch');
        $rootScope.$apply();

        $controller('ProgramSearchCtrl', { $scope: scope, SearchFactory: mockSearchResource, $state: $state });
        spyOn(scope, 'prepareAdvancedSearchDataStructure');
        scope.getSearchResults(tableState);
        expect(scope.searchResults).toBe(testResults);
        expect(scope.prepareAdvancedSearchDataStructure).toHaveBeenCalled();
    });

    it('Should restructure advanced search data', function(){
        var scope = {};
        var tableState = {
            search: {},
            pagination: {},
            sort: {}
        };
        var oAdvancedSearchDataStruture = {
            "aAssistanceType": ["0001001"],
            "aFunctionalCode": ["0001003"],
            "aApplicantEligibility": ["0001"],
            "aBeneficiaryEligibility": ["1"],
            "datePublishedStart": "2014-01-01T05:00:00.000Z",
            "datePublishedEnd": "2016-03-02T05:00:00.000Z",
            "executiveOrder12372": "yes"
        };

        $state.transitionTo('advancedSearch');
        $rootScope.$apply();

        $controller('ProgramSearchCtrl', { $scope: scope, SearchFactory: mockSearchResource, $state: $state });
        scope.getSearchResults(tableState);
        expect(scope.searchResults).toBe(testResults);
        var result = scope.prepareAdvancedSearchDataStructure(mockSearchResource.getSearchCriteria().advancedSearch);
        expect(result).toEqual(oAdvancedSearchDataStruture);
    });

    it('should instantiate getSearchResults function', function() {
        var scope = {};
        $controller('ProgramSearchCtrl', { $scope: scope });
        expect(scope.getSearchResults).toBeDefined();
    });

    it('should set scope loading to true', function() {
        var scope = { isLoading: false };
        $controller('ProgramSearchCtrl', { $scope: scope });
        scope.getSearchResults();
        expect(scope.searchResults).toBeDefined();
        expect(scope.searchResults).toEqual(testResults);
    });

    it('should call search resource to query results', function() {
        var scope = $rootScope.$new();

        var obj = mockSearchResource.search();
        spyOn(mockSearchResource, 'search').and.returnValue(obj);
        $controller('ProgramSearchCtrl', { $scope: scope, SearchFactory: mockSearchResource });
        scope.globalSearchValue = testKeyword;
        scope.getSearchResults();
        expect(mockSearchResource.search).toHaveBeenCalled();
    });

    it('should populate scope correctly after data is returned', function() {
        var scope = {};
        var tableState = {
            search: {},
            pagination: {},
            sort: {}
        };
        $controller('ProgramSearchCtrl', { $scope: scope, SearchFactory: mockSearchResource, appConstants: appConstants });
        scope.globalSearchValue = testKeyword;
        scope.getSearchResults(tableState);
        expect(scope.isLoading).toBe(false);
        expect(scope.searchResults).toBe(testResults);
        expect(tableState.pagination.numberOfPages).toBe(Math.ceil(testTotalCount / appConstants.DEFAULT_PAGE_ITEM_NUMBER));
    });

    describe('Sorting', function() {
        var testSortColumn = 'Test Column';
        var scope;
        var tableState;

        beforeEach(function() {
            scope = {};
            tableState = {
                search: {},
                pagination: {},
                sort: {
                    predicate: testSortColumn
                }
            };
        });

        it('should sort by ascending', function() {
            $controller('ProgramSearchCtrl', { $scope: scope, appConstants: appConstants });
            scope.globalSearchValue = testKeyword;
            scope.getSearchResults(tableState);
            expect(mockSearchResource.queryObject.sortBy).toBe(testSortColumn);

        });

        it('should sort by descending', function() {
            tableState.sort.reverse = true;
            $controller('ProgramSearchCtrl', { $scope: scope, appConstants: appConstants });
            scope.globalSearchValue = testKeyword;
            scope.getSearchResults(tableState);
            expect(mockSearchResource.queryObject.sortBy).toBe('-' + testSortColumn);
        });
    });
});