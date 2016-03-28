'use strict';

describe("Unit Tests for Programs List Controller", function () {
    var $controller,
        $httpBackend,
        $state,
        $rootScope,
        User,
        ProgramFactory,
        ApiService,
        appConstants,
        oApiParam,
        totalCount,
        UserService;

    beforeEach(function() {
        var env = {'pub.api.programs': '/api'};
        module(function($provide) {
            $provide.value('env', env);
        });
        //
        //setup oApiParam variable
        oApiParam = {
            apiName: 'programList',
            apiSuffix: '',
            oParams: {
                limit: 5,
                offset: 0,
                includeCount: true
            }, 
            oData: {}, 
            method: 'GET'
        };

        totalCount = 1000;
        inject(function(_$controller_, _$state_, _appConstants_, _$httpBackend_, _ProgramFactory_,_ApiService_, _$rootScope_, _User_, _UserService_){
            $controller = _$controller_;
            $state = _$state_;
            appConstants = _appConstants_;
            $httpBackend = _$httpBackend_;
            ProgramFactory = _ProgramFactory_;
            ApiService = _ApiService_;
            $rootScope = _$rootScope_;
            User = _User_;
            UserService = _UserService_;
        });

        $httpBackend
            .whenGET(/\/api\/programs(\?[\w=&]+)*/i)
            .respond(angular.toJson({
                result: [
                    {
                        1: {
                            id: 1
                        },
                        2: {
                            id: 2
                        },
                        3: {
                            id: 3
                        },
                        4: {
                            id: 4
                        },
                        5: {
                            id: 5
                        }
                    }
                ],
                "totalCount":totalCount,"offset":0,"limit":oApiParam.oParams.limit
            }));
        $httpBackend
            .whenDELETE('/api/programs')
            .respond(200);

        UserService.changeUser({ "roles": ["GSA_CFDA_R_cfdasuperuser"] });
    });

    describe("Default Programs List Controller", function() {
        var $scope, controller;

        beforeEach(function(){
            $scope = { $parent: {
                    programStatus: ''
            }};
            controller = $controller('ProgramsListCtrl as vm', {
                $scope: $scope
            });
        });


        it('should have global methods and variables defined before program list load', function() {
            expect($scope).toBeDefined();
            expect($scope.itemsByPage).toBeDefined();
            expect($scope.itemsByPage).toEqual(appConstants.DEFAULT_PAGE_ITEM_NUMBER);
            expect($scope.itemsByPageNumbers).toBeDefined();
            expect($scope.itemsByPageNumbers).toEqual(appConstants.PAGE_ITEM_NUMBERS);
            expect($scope.loadPrograms).toBeDefined();
            expect($scope.editProgram).toBeDefined();
            expect($scope.deleteProgram).toBeDefined();
        });

        it('should be able to query a list of programs', function(done){
            var vm = $scope,
                tableState = {
                    search: {},
                    sort: {},
                    pagination:{
                        start: 0
                    }
                };

            spyOn(ApiService, 'call').and.callThrough();
            vm.itemsByPage = oApiParam.oParams.limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                var pagination = tableState.pagination;

                expect(ApiService.call).toHaveBeenCalledWith(oApiParam);
                expect(pagination.numberOfPages).toEqual(200);
                expect(pagination.totalItemCount).toEqual(totalCount);

                done();
            });
            $httpBackend.flush();
        });

        it('should be able to query a list of programs with ascending sorting', function(done){
            var vm = $scope,
                tableState = {
                    search: {},
                    sort: {
                        reverse: false,
                        predicate: 'title'
                    },
                    pagination:{
                        start: 0
                    }
                };

            spyOn(ApiService, 'call').and.callThrough();
            vm.itemsByPage = oApiParam.oParams.limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                oApiParam.oParams['sortBy'] = 'title';
                expect(ApiService.call).toHaveBeenCalledWith(oApiParam);
                done();
            });
            $httpBackend.flush();
        });

        it('should be able to query a list of programs with descending sorting', function(done){
            var vm = $scope,
                tableState = {
                    search: {},
                    sort: {
                        reverse: true,
                        predicate: 'title'
                    },
                    pagination:{
                        start: 0
                    }
                };

            spyOn(ApiService, 'call').and.callThrough();
            vm.itemsByPage = oApiParam.oParams.limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                oApiParam.oParams['sortBy'] = '-title';
                expect(ApiService.call).toHaveBeenCalledWith(oApiParam);
                done();
            });
            $httpBackend.flush();
        });

        it('should be able to perform a search on the list of programs', function(done){
            var vm = $scope,
                tableState = {
                    search: {
                        predicateObject: {
                            $: 'keyword'
                        }
                    },
                    sort: { },
                    pagination:{
                        start: 0
                    }
                };

            spyOn(ApiService, 'call').and.callThrough();
            vm.itemsByPage = oApiParam.oParams.limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                oApiParam.oParams['keyword'] = 'keyword';
                expect(ApiService.call).toHaveBeenCalledWith(oApiParam);
                done();
            });
            $httpBackend.flush();
        });

        it("should be able to call $state to go to the 'editProgram' state", function(){
            var vm = $scope;
            spyOn($state, 'go');

            vm.editProgram({
                id: 1
            });

            expect($state.go).toHaveBeenCalledWith('editProgram', {
                id: 1,
                section: 'info'
            });
        });

        it("should be able to call $state to go to the 'editProgram' state with a specified section name", function(){
            var vm = $scope;
            spyOn($state, 'go');

            vm.editProgram({
                id: 1
            }, 'review');

            expect($state.go).toHaveBeenCalledWith('editProgram', {
                id: 1,
                section: 'review'
            });
        });

//        it("should be able to call the Program service's $delete function", function(done){
//            var vm = $scope,
//                program = new ProgramFactory();
//
//            spyOn(program, '$delete').and.callThrough();
//            spyOn(vm, 'loadPrograms').and.callThrough();
//
//            vm.deleteProgram(program).then(function(){
//                expect(vm.loadPrograms).toHaveBeenCalled();
//                done();
//            });
//
//            expect(program.$delete).toHaveBeenCalled();
//            $httpBackend.flush();
//
//        });
    });
});
