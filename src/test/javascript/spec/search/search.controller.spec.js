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
            var $location;
            beforeEach(inject(function(_$location_) {
                $location = _$location_;
            }));

            it('should change location path if globalSearchValue is passed', function() {
                var scope = $rootScope.$new();
                var rootScope = {};
                spyOn($location, 'path');
                spyOn($location, 'search');
                $controller('ProgramSearchCtrl', { $rootScope: rootScope, $scope: scope, $location: $location });
                scope['globalSearchValue'] = testKeyword;
                scope.searchPrograms();
                expect($location.path).toHaveBeenCalledWith('/search');
                expect($location.search).toHaveBeenCalledWith('keyword', testKeyword);
            });

            it('should not change location path if globalSearchValue is missing', function() {
                var scope = $rootScope.$new();
                spyOn($location, 'path');
                $controller('ProgramSearchCtrl', { $scope: scope, $location: $location });
                scope.searchPrograms();
                scope.$digest();
                expect($location.path).not.toHaveBeenCalledWith('/search');
            });

            it('should set globalSearchValue in rootScope to value in scope', function() {
                var scope = $rootScope.$new();
                var rootScope = {};
                $controller('ProgramSearchCtrl', { $rootScope: rootScope, $scope: scope, $location: $location });
                scope['globalSearchValue'] = testKeyword;
                scope.searchPrograms();
                scope.$digest();
                expect(rootScope.globalSearchValue).toBe(testKeyword);
            });
        })
    });

    describe('$scope.getSearchResults', function() {
        var testSortColumn = 'Test Column';
        var testResults = [ 'Result 1', 'Result 2' ];

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
            var mockSearchResource;
            beforeEach(function() {
                mockSearchResource = {
                    get: function(queryObject, fnCallback) {
                        console.log(arguments);
                        fnCallback(testResults);
                    }
                }
            });

            it('should call search resource to query results', function() {
            });

            it('should handle returned results', function() {
            });

            it('should sort by ascending', function() {

            });

            it('should sort by descending', function() {

            });
        });
    });
});