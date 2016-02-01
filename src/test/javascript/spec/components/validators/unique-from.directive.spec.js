'use strict';

describe('Unit Tests for the uniqueFrom validator', function() {
    var $compile,
        $rootScope,
        $window,
        plainInputHtml,
        nomodelInputHtml,
        ngListInputHtml,
        ngListWithPatternInputHtml;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$window_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        plainInputHtml = '' +
            '<form name="form">' +
                '<input type="text" name="primaryTitle" ng-model="primaryTitle">"' +
                '<input type="text" name="secondaryTitle" ng-model="secondaryTitle" unique-from="primaryTitle">' +
            '</form>';
        nomodelInputHtml = plainInputHtml.replace('ng-model="secondaryTitle"', "");
        ngListInputHtml = plainInputHtml.replace('ng-model="secondaryTitle"', 'ng-list ng-model="secondaryTitle"');
        ngListWithPatternInputHtml = ngListInputHtml.replace("ng-list", "ng-list='\-'");

    }));

    function createElement(html){
        var element = $compile(html)($rootScope);
        $rootScope.$digest();

        return {
            form: element,
            primaryInput: angular.element(element.find('input')[0]),
            secondaryInput: angular.element(element.find('input')[1])
        }
    }

    it("should not throw a validation if both fields don't have a String value but equal", function() {
        var element = createElement(plainInputHtml);

        expect($rootScope.form.secondaryTitle.$invalid).toBe(false);
    });

    it("should throw a validation error if the two fields are the same String value", function() {
        var element = createElement(plainInputHtml);

        element.primaryInput.val('My Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(false);

        element.secondaryInput.val('My Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(true);
        expect($rootScope.form.secondaryTitle.$error.uniqueFrom).toBeDefined();


        element.secondaryInput.val('My Secondary Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(false);

    });

    it("should not add the validator config if the input does not have ngModel", function() {
        var element = createElement(nomodelInputHtml);

        element.primaryInput.val('My Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.$invalid).toBe(false);

        element.secondaryInput.val('My Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.$invalid).toBe(false);

        element.secondaryInput.val('My Secondary Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.$invalid).toBe(false);
    });

    it("should throw a validation error if any of the items in the ng-list default pattern matches the targeted field", function() {
        var element = createElement(ngListInputHtml);

        element.primaryInput.val('My Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(false);

        element.secondaryInput.val('Secondary, My Title, Unique Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(true);
        expect($rootScope.form.secondaryTitle.$error.uniqueFrom).toBeDefined();


        element.secondaryInput.val('Secondary, New Title, Unique Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(false);

    });

    it("should throw a validation error if any of the items in the ng-list with a pattern matches the targeted field", function() {
        var element = createElement(ngListWithPatternInputHtml);

        element.primaryInput.val('My Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(false);

        element.secondaryInput.val('Secondary-My Title-Unique Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(true);
        expect($rootScope.form.secondaryTitle.$error.uniqueFrom).toBeDefined();


        element.secondaryInput.val('Secondary-New Title-Unique Title').trigger('input');
        $rootScope.$digest();
        expect($rootScope.form.secondaryTitle.$invalid).toBe(false);

    });
});