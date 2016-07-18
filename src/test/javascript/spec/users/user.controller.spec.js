'use strict';

describe('Unit Tests for User Controller:', function () {
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

        UserService.setUser({"role": "GSA_CFDA_R_cfdasuperuser"});
    });

    describe('Controller User:', function () {
        var scope;

        beforeEach(function(){
            scope = $rootScope.$new();
        });

        it('should initialize variables', function () {
            $controller('UserListCtrl', {$scope: scope});

            expect(scope.searchKeyword).toBeDefined();
            expect(scope.dtInstance).toBeDefined();
            expect(scope.defaultRoleText).toBeDefined();
            expect(scope.filter).toBeDefined();
            expect(scope.showOMBAllOrganization).toBeDefined();
            expect(scope.clearSearchForm).toBeDefined();
            expect(scope.canEditUser).toBeDefined();
            expect(scope.dtOptions).toBeDefined();
            expect(scope.dtColumns).toBeDefined();
        });

        describe('Controller User: Testing', function () {
            var $state;

            beforeEach(function(){
                //expecting api/federalHierarchy to load organizations
                $httpBackend.whenGET(/\/v1\/federalHierarchy\?ids=[\w\,]+/i).respond([{elementId: 1, hierarchy:[], name: "test"}]);

                inject(function(_$state_, _$timeout_){
                    $state = _$state_;
//                    $timeout = _$timeout_;
                });
            });

            it('Clear Search', function () {
                $controller('UserListCtrl', {$scope: scope});

                spyOn($state, 'go');
                scope.clearSearchForm();
                expect($state.go).toHaveBeenCalled();
            });
        });
    });
});