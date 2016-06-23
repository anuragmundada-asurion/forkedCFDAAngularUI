'use strict';

describe("Unit Tests for internal Offce List Controller", function () {
    var $controller,
        $httpBackend,
        $rootScope,
        $state,
        appConstants,
        ApiService,
        util;

    beforeEach(function() {
        inject(function(_$controller_, _$httpBackend_, _$rootScope_, _util_, _$state_, _appConstants_, _ApiService_){
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            util = _util_;
            $state = _$state_;
            appConstants = _appConstants_;
            ApiService= _ApiService_;
        });

    });

    describe("Default RegionalOfficeList Controller", function() {
        var $scope, controller;

        beforeEach(function(){
            $scope = $rootScope.$new();
            controller = $controller('RegionalOfficeListController', {
                $scope: $scope
            });
        });

        it('should have global methods and variables defined', function() {
            expect($scope).toBeDefined();
            expect($scope.itemsByPage).toBeDefined();
            expect($scope.itemsByPageNumbers).toBeDefined();
            expect($scope.dictionary).toBeDefined();
            expect($scope.filter).toBeDefined();
        });

    });
});
