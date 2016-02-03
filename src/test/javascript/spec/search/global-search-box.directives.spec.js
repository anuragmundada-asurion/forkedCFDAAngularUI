'use strict';

describe('Unit Tests for Global Search Box Directive', function() {
    var element;
    var $rootScope;
    var $compile;

    beforeEach(function() {
        module('templates');
        module('app');
    });

    beforeEach(inject(function(_$rootScope_, _$compile_) {
        element = '<global-search-box></global-search-box>';
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    it('should only allow elements', function() {
        var invalidDirective = '<div global-search-box="" class="ng-scope"></div>';
        element = $compile(invalidDirective)($rootScope);
        $rootScope.$digest();
        expect(element[0].outerHTML).toBe(invalidDirective);

    });

    it('should have results header', function() {
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('.page-heading')).toBeDefined();
    });

    it('should have results table', function() {
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('.search-table')).toBeDefined();
    });

    it('should have results pagination', function() {
        element = $compile(element)($rootScope);
        $rootScope.$digest();
        expect(element.find('.pagination-panel')).toBeDefined();
    });
});