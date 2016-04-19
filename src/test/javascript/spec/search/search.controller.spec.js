'use strict';

describe('Unit Tests for Program Search Controller', function() {
    var $controller;
    var $rootScope;
    var testKeyword = "ASDF Test Search";
    var SearchFactory;
    var $httpBackend;

    beforeEach(function() {
        inject(function(_$rootScope_, _$controller_, _$httpBackend_, _SearchFactory_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            SearchFactory = _SearchFactory_;
            $httpBackend = _$httpBackend_;
        });

        $httpBackend
            .whenGET(/\/api\/dictionaries(\?ids=[a-z_]+)*/i)
            .respond({});
    });

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