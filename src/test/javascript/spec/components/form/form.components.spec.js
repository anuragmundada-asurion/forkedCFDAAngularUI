'use strict';

describe('Unit Tests for fieldFinderForm', function() {
    var scope, directiveElement;

    beforeEach(function() {
        module('app');
        inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            var element = angular.element('<field-finder-form></field-finder-form>');
            directiveElement = $compile(element)(scope);
            scope.$digest();
        });
    });
});