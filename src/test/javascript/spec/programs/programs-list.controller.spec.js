'use strict';

describe("Unit Tests for Programs List Controller", function () {
    var $controller,
        $httpBackend,
        $state,
        Program,
        appConstants,
        totalCount,
        limit;

    beforeEach(function() {
        module('app');
        module('templates');
        var env = {'pub.api.programs': 'http://gsaiae-cfda-program-uat01.reisys.com/api/v1'};
        module(function($provide) {
            $provide.value('env', env);
        });
        //
        totalCount = 1000;
        limit = 5;
        inject(function(_$controller_, _$state_, _appConstants_, _$httpBackend_, _Program_){
            $controller = _$controller_;
            $state = _$state_;
            appConstants = _appConstants_;
            $httpBackend = _$httpBackend_;
            Program = _Program_;
        });

        $httpBackend
            .whenGET(/http:\/\/gsaiae-cfda-program-uat01.reisys.com\/api\/v1\/programs(\?[\w=&]+)*/i)
            .respond(angular.toJson({
                result: [
                    {
                        1: {
                            _id: 1
                        },
                        2: {
                            _id: 2
                        },
                        3: {
                            _id: 3
                        },
                        4: {
                            _id: 4
                        },
                        5: {
                            _id: 5
                        }
                    }
                ],
                "totalCount":totalCount,"offset":0,"limit":limit
            }));
        $httpBackend
            .whenDELETE('http://gsaiae-cfda-program-uat01.reisys.com/api/v1/programs')
            .respond(200);
    });

    describe("Default Programs List Controller", function() {
        var $scope, controller;

        beforeEach(function(){
            $scope = {};
            controller = $controller('ProgramsListController as vm', {
                $scope: $scope
            });
        });


        it('should have global methods and variables defined before program list load', function() {
            var vm = $scope.vm;

            expect(vm).toBeDefined();
            expect(vm.itemsByPage).toBeDefined();
            expect(vm.itemsByPage).toEqual(appConstants.DEFAULT_PAGE_ITEM_NUMBER);
            expect(vm.itemsByPageNumbers).toBeDefined();
            expect(vm.itemsByPageNumbers).toEqual(appConstants.PAGE_ITEM_NUMBERS);
            expect(vm.loadPrograms).toBeDefined();
            expect(vm.editProgram).toBeDefined();
            expect(vm.deleteProgram).toBeDefined();
        });

        it('should be able to query a list of programs', function(done){
            var vm = $scope.vm,
                tableState = {
                    search: {},
                    sort: {},
                    pagination:{
                        start: 0
                    }
                };

            spyOn(Program, 'query').and.callThrough();
            vm.itemsByPage = limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.programs.$promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                var pagination = tableState.pagination;

                expect(Program.query).toHaveBeenCalledWith({
                    limit: limit,
                    offset: 0,
                    includeCount: true
                });
                expect(pagination.numberOfPages).toEqual(200);
                expect(pagination.totalItemCount).toEqual(totalCount);

                done();
            });
            $httpBackend.flush();
        });

        it('should be able to query a list of programs with ascending sorting', function(done){
            var vm = $scope.vm,
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

            spyOn(Program, 'query').and.callThrough();
            vm.itemsByPage = limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.programs.$promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                expect(Program.query).toHaveBeenCalledWith({
                    limit: limit,
                    offset: 0,
                    includeCount: true,
                    sortBy: "title"
                });
                done();
            });
            $httpBackend.flush();
        });

        it('should be able to query a list of programs with descending sorting', function(done){
            var vm = $scope.vm,
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

            spyOn(Program, 'query').and.callThrough();
            vm.itemsByPage = limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.programs.$promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                expect(Program.query).toHaveBeenCalledWith({
                    limit: limit,
                    offset: 0,
                    includeCount: true,
                    sortBy: "-title"
                });
                done();
            });
            $httpBackend.flush();
        });

        it('should be able to perform a search on the list of programs', function(done){
            var vm = $scope.vm,
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

            spyOn(Program, 'query').and.callThrough();
            vm.itemsByPage = limit;
            vm.loadPrograms(tableState);

            expect(vm.isLoading).toBe(true);

            vm.programs.$promise.finally(function(){
                expect(vm.isLoading).toBe(false);
                expect(Program.query).toHaveBeenCalledWith({
                    limit: limit,
                    offset: 0,
                    includeCount: true,
                    keyword: 'keyword'
                });
                done();
            });
            $httpBackend.flush();
        });

        it("should be able to call $state to go to the 'editProgram' state", function(){
            var vm = $scope.vm;
            spyOn($state, 'go');

            vm.editProgram({
                _id: 1
            });

            expect($state.go).toHaveBeenCalledWith('editProgram', {
                id: 1,
                section: 'info'
            });
        });

        it("should be able to call $state to go to the 'editProgram' state with a specified section name", function(){
            var vm = $scope.vm;
            spyOn($state, 'go');

            vm.editProgram({
                _id: 1
            }, 'review');

            expect($state.go).toHaveBeenCalledWith('editProgram', {
                id: 1,
                section: 'review'
            });
        });

        it("should be able to call the Program service's $delete function", function(done){
            var vm = $scope.vm,
                program = new Program();

            spyOn(program, '$delete').and.callThrough();
            spyOn(vm, 'loadPrograms').and.callThrough();

            vm.deleteProgram(program).then(function(){
                expect(vm.loadPrograms).toHaveBeenCalled();
                done();
            });

            expect(program.$delete).toHaveBeenCalled();
            $httpBackend.flush();

        });
    });
});
