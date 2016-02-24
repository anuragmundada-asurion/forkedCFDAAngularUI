'use strict';

describe("Unit Tests for Home Controller", function () {
    var $controller,
        $httpBackend,
        $rootScope,
        $state,
        Program,
        util;

    beforeEach(function() {
        module('templates');
        module('app');

        function Program() {
            angular.extend(this, {
                save: function() {},
                update: function() {}
            });
        }

        module(function($provide) {
            $provide.value('program', new Program());
        });

        inject(function(_$controller_, _$httpBackend_, _$rootScope_, _util_, _$state_, _Program_){
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            Program = _Program_;
            util = _util_;
            $state = _$state_;
        });
    });

        describe("Default Add Edit Controller", function() {
        var $scope, controller;

        beforeEach(function(){
            $scope = $rootScope.$new();
            controller = $controller('HomeController as vm', {
                $scope: $scope
            });
        });

        it('should have the ability to go to programList', function(){
            spyOn($state, 'go');

            controller.programList();
            expect($state.go).toHaveBeenCalledWith('programList');
        });

    })
});
