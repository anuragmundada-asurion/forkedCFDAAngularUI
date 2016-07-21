'use strict';

describe('Unit Tests for Organization View Controller:', function () {
    beforeEach(module('app'));

    //dependencies to be injected
    var $rootScope,
        $httpBackend,
        $controller,
        UserService,
        $stateParams;

    beforeEach(function () {
        inject(function (_$rootScope_, _$controller_, _$httpBackend_,_UserService_, _$stateParams_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            UserService = _UserService_;
            $stateParams = _$stateParams_;
        });

        UserService.setUser({"role": "GSA_CFDA_R_cfdasuperuser"});
    });

    describe('Controller Organization View:', function () {
        var scope;

        beforeEach(function(){
            scope = $rootScope.$new();

            $httpBackend
                .whenGET(/\/v1\/federalHierarchyConfiguration\/1/i)
                .respond({});

            $httpBackend
                .whenGET(/\/v1\/federalHierarchy\/1(\?parentLevels=[\w]+\&sort=[\w]+)*/i)
                .respond({});

            $httpBackend
                .whenGET('/v1/federalHierarchy?sort=name')
                .respond({});
        });

        it('should initialize variables', function () {
            $stateParams.id = 1;
            $controller('OrganizationViewCtrl', {$scope: scope, $stateParams: $stateParams});

            expect(scope.id).toBeDefined();
            expect(scope.id).toBe($stateParams.id);
            $httpBackend.flush();
            expect(scope.oOrganization).toBeDefined();
        });
    });
});