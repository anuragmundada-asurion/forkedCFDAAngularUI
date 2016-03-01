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
        module('templates');
        module('app');


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
            .whenGET(/\/api\/listingcount(\?[\d=&]+)*/i)
            .respond(angular.toJson({ 'new': 100, 'updated': 10, 'archived': 100 }));
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

//        it('should be able to query a count of programs', function(done){
//            var vm = $scope;
//            
//            var oApiParam = {
//                apiName: 'programCount',
//                apiSuffix: '/'+vm.currentYear,
//                oParams: {}, 
//                oData: {}, 
//                method: 'GET'
//            };
//
//            spyOn(ApiService, 'call').and.callThrough();
//
////            vm.promise.finally(function() {
////                expect(vm.isLoading).toBe(false);
////                var pagination = tableState.pagination;
////
////                expect(ApiService.call).toHaveBeenCalledWith(oApiParam);
////                expect(pagination.numberOfPages).toEqual(200);
////                expect(pagination.totalItemCount).toEqual(totalCount);
////
////                done();
////            });
//            
//            expect(ApiService.call).toHaveBeenCalledWith(oApiParam);
//
//            $httpBackend.flush();
//            done();
//        });

    });
});
