'use strict';

describe("Unit Tests for Programs List Controller", function () {
    var $controller,
        appConstants;

    beforeEach(function() {
        module('app');
        var env = {'pub.api.programs': 'http://gsaiae-cfda-program-uat01.reisys.com/api/v1'};
        module(function($provide) {
            $provide.value('env', env);
        });

        inject(function(_$controller_, _appConstants_){
            $controller = _$controller_;
            appConstants = _appConstants_;
        });
    });

    describe("Default Programs List Controller", function() {
        var $scope, controller;

        beforeEach(function(){
            $scope = {};
            controller = $controller('ProgramsListController as vm', {
                $scope: $scope
            });
        });


        it('should have global methods and variables defined before program list load', inject(function() {
            var vm = $scope.vm;

            expect(vm).toBeDefined();
            expect(vm.itemsByPage).toBeDefined();
            expect(vm.itemsByPage).toEqual(appConstants.DEFAULT_PAGE_ITEM_NUMBER);
            expect(vm.itemsByPageNumbers).toBeDefined();
            expect(vm.itemsByPageNumbers).toEqual(appConstants.PAGE_ITEM_NUMBERS);
            expect(vm.loadPrograms).toBeDefined();
            expect(vm.editProgram).toBeDefined();
            expect(vm.deleteProgram).toBeDefined();
        }));
    })
});
