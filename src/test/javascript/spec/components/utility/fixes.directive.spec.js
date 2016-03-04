'use strict';

describe('Unit Tests for miscellaneous field fixes', function() {
    var $compile,
        $rootScope,
        $window,
        inputHtml,
        inputNgListHtml;

    beforeEach(module('templates'));
    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$window_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        inputHtml = '<input type="text" name="myInput" ng-minlength="5" ng-model="value">"',
        inputNgListHtml = '<input ng-list type="text" name="myInput" ng-minlength="5" ng-model="value">"';
    }));

    function createElement(html){
        var element = $compile(html)($rootScope);
        $rootScope.$digest();

        return element;
    }

    it("should add autocomplete='off' for input fields if autocomplete is not defined", function() {
        var element = createElement(inputHtml),
            expectResult = expect(element.attr('autocomplete'));

        expectResult.toBeDefined();
        expectResult.toEqual('off');
    });

    it("should not add the autocomplete attribute to input fields if one exists", function(){
        var element = createElement("<input autocomplete='on'>"),
            expectResult = expect(element.attr('autocomplete'));
        expectResult.toBeDefined();
        expectResult.toEqual('on');
    });

    it("should save model data back even if field is throwing a validation error", function(){
        $rootScope.value = 't';

        var element = createElement("<form name='form'>" + inputHtml + "</form>"),
            inputElement = element.find('input');

        inputElement.val('Some text').trigger('input');
        $rootScope.$digest();

        expect($rootScope.form.myInput.$invalid).toBe(false);
        expect($rootScope.value).toEqual('Some text');

        inputElement.val(undefined).trigger('input');
        $rootScope.$digest();

        expect($rootScope.form.myInput.$invalid).toBe(false);
        expect($rootScope.value).toEqual('');
    });

    it("should respect other $parsers if field is not valid and save to model", function() {
        var element = createElement("<form name='form'>" + inputNgListHtml + "</form>"),
            inputElement = element.find('input');
        inputElement.val('a, b, c, d, e').trigger('input');
        $rootScope.$digest();

        expect($rootScope.form.myInput.$invalid).toBe(false);
        expect($rootScope.value).toEqual(['a', 'b', 'c', 'd', 'e']);
    })
});