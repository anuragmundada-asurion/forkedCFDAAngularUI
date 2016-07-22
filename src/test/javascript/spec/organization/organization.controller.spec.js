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

            $httpBackend
                .whenGET('/v1/federalHierarchy?childrenLevels=all&parentLevels=all&sort=name')
                .respond({
                    _links:{},
                    type: "",
                    elementId: ""
                });
        });

        it('should initialize variables (View)', function () {
            $stateParams.id = 1;
            $controller('OrganizationViewCtrl', {$scope: scope, $stateParams: $stateParams});

            expect(scope.id).toBeDefined();
            expect(scope.id).toBe($stateParams.id);
            $httpBackend.flush();
            expect(scope.oOrganization).toBeDefined();
        });

        it('should initialize variables (List)', function () {
            $stateParams.id = 1;
            $controller('OrganizationListController', {$scope: scope});

            expect(scope.searchKeyword);
            scope.dtInstance = { DataTable: {ajax: {reload: function(){}}} };
            $httpBackend.flush();

            expect(scope.dtData_topLevel).toBeDefined();
            expect(scope.dtData_total).toBeDefined();
            expect(scope.childrenMap).toBeDefined();
            expect(scope.dtData).toBeDefined();
            expect(scope.loadOrganizations).toBeDefined();
            expect(scope.rowClicked).toBeDefined();
            expect(scope.dtInstance).toBeDefined();
            expect(scope.dtColumnDefs).toBeDefined();
            expect(scope.dtOptions).toBeDefined();
            expect(scope.dtColumns).toBeDefined();
        });

        it('should initialize variables (Form)', function () {
            $stateParams.id = 1;
            $controller('OrganizationFormCtrl', {$scope: scope, $stateParams: $stateParams});

            expect(scope.items);
            expect(scope.selected);
            expect(scope.saveFhConfiguration);
            $httpBackend.flush();
            expect(scope.oOrganization);
        });
    });
});