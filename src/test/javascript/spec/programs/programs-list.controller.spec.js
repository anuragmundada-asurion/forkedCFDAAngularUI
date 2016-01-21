'use strict';

describe("Unit Tests for Programs List Controller", function () {
    var $controller;

    beforeEach(function() {
        module('app');
        inject(function(_$controller_){
            $controller = _$controller_;
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


        it('should have global methods', inject(function() {
            expect($scope.vm).toBeDefined();
            expect($scope.vm.loadPrograms).toBeDefined();
            expect($scope.vm.editProgram).toBeDefined();
            expect($scope.vm.deleteProgram).toBeDefined();
        }));
    })
});
