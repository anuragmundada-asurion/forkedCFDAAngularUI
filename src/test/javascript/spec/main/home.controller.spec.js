'use strict';

describe("Unit Tests for Home Controller", function () {
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

        $httpBackend
            .whenGET(/\/v1\/listingcount(\?[\d=&]+)*/i)
            .respond(angular.toJson({ 'new': 100, 'updated': 10, 'archived': 100 }));

        $httpBackend
            .whenGET(/\/v1\/eligibilitylistings/i)
            .respond(angular.toJson([{"label":"Local","count":830,"ids":["0011"]},{"label":"State","count":1496,"ids":["0009","0040"]}]));
    });

    describe("Default Home Controller", function() {
        var $scope, controller;

        beforeEach(function(){
            $scope = $rootScope.$new();
            controller = $controller('HomeController', {
                $scope: $scope
            });
        });

        it('should have global methods and variables defined', function() {
            expect($scope).toBeDefined();
            expect($scope.itemsByPage).toBeDefined();
            expect($scope.itemsByPage).toEqual(appConstants.DEFAULT_PAGE_ITEM_NUMBER);
            expect($scope.itemsByPageNumbers).toBeDefined();
            expect($scope.itemsByPageNumbers).toEqual(appConstants.PAGE_ITEM_NUMBERS);
            expect($scope.currentYear).toBeDefined();
            expect($scope.data).toBeDefined();
            expect($scope.formatNumber).toBeDefined();
        });

    });
});
