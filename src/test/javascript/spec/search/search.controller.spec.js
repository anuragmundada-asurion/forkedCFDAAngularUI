'use strict';

describe('Unit Tests for Program Search Controller', function() {
    var $controller;
    var $rootScope;
    var testKeyword = "ASDF Test Search";

    beforeEach(function() {
        module('app');
    });

    beforeEach(inject(function(_$rootScope_, _$location_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
    }));

    describe('$scope.globalSearchValue', function() {
        it('should set the default value of globalSearchValue', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope });
            expect(scope.globalSearchValue).toBe('');
        });

        it('should set the value of globalSearchValue to what is present in rootScope', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope, $rootScope: { 'globalSearchValue': 'Test Keyword' } });
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
                var rootScope = {};
                spyOn($state, 'go');
                $controller('ProgramSearchCtrl', { $rootScope: rootScope, $scope: scope, $state: $state });
                scope['globalSearchValue'] = testKeyword;
                scope.searchPrograms();
                scope.$digest();
                expect(rootScope.globalSearchValue).toBe(testKeyword);
            });
        })
    });

    describe('$scope.getSearchResults', function() {
        it('should instantiate getSearchResults function', function() {
            var scope = {};
            $controller('ProgramSearchCtrl', { $scope: scope });
            expect(scope.getSearchResults).toBeDefined();
        });

        it('should set scope loading to true', function() {
            var scope = { isLoading: false };
            $controller('ProgramSearchCtrl', { $scope: scope });
            scope.getSearchResults();
            expect(scope.isLoading).toBe(true);
        });

        describe('Search.get', function() {
            var testResults = [ 'Result 1', 'Result 2' ];
            var testTotalCount = 100;
            var mockSearchResource;
            var appConstants;

            beforeEach(function() {
                mockSearchResource = {
                    get: function(queryObject, fnCallback) {
                        this.queryObject = queryObject;
                        fnCallback({
                            totalCount: testTotalCount,
                            results: testResults
                        });
                    }
                };
            });

            beforeEach(inject(function(_appConstants_) {
                appConstants = _appConstants_;
            }));

            it('should call search resource to query results', function() {
                var scope = {};
                spyOn(mockSearchResource, 'get').and.returnValue({});
                $controller('ProgramSearchCtrl', { $scope: scope, Search: mockSearchResource });
                scope.globalSearchValue = testKeyword;
                scope.getSearchResults();
                expect(mockSearchResource.get).toHaveBeenCalled();
            });

            it('should populate scope correctly after data is returned', function() {
                var scope = {};
                var tableState = {
                    search: {},
                    pagination: {},
                    sort: {}
                };
                $controller('ProgramSearchCtrl', { $scope: scope, Search: mockSearchResource, appConstants: appConstants });
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
                    $controller('ProgramSearchCtrl', { $scope: scope, Search: mockSearchResource, appConstants: appConstants });
                    scope.globalSearchValue = testKeyword;
                    scope.getSearchResults(tableState);
                    expect(mockSearchResource.queryObject.sortBy).toBe(testSortColumn);

                });

                it('should sort by descending', function() {
                    tableState.sort.reverse = true;
                    $controller('ProgramSearchCtrl', { $scope: scope, Search: mockSearchResource, appConstants: appConstants });
                    scope.globalSearchValue = testKeyword;
                    scope.getSearchResults(tableState);
                    expect(mockSearchResource.queryObject.sortBy).toBe('-' + testSortColumn);
                });
            });
        });
    });
});