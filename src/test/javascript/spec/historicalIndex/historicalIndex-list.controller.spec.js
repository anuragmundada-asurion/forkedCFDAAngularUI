'use strict';

describe('Unit Tests for Historical Index List Controller:', function () {
    //load app
    beforeEach(module('app'));

    //dependencies to be injected
    var $rootScope,
        $httpBackend,
        $controller,
        UserService;

    beforeEach(function () {
        inject(function (_$rootScope_, _$controller_, _$httpBackend_,_UserService_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            UserService = _UserService_;
        });
    });

    describe('Controller Historical Index List:', function () {
        var scope;

        beforeEach(function(){
            scope = $rootScope.$new();

        });

        it('should initialize historical index list variables', function () {
            $controller('HistoricalIndexListController', {$scope: scope});

            expect(scope.itemsByPage).toBeDefined();
            expect(scope.itemsByPageNumbers).toBeDefined();
        });

    });
});