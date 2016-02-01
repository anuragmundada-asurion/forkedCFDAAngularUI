'use strict';

describe('Unit Tests for the requiredLength validator', function() {
    var $compile,
        $rootScope,
        $window,
        arrayInputHtml,
        nomodelInputHtml,
        minMaxArrayInputHtml,
        strictSizeArrayInputHtml,
        requiredIfArrayInputHtml,
        invalidRequiredLengthValueInputHtml;

    beforeEach(module('app'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$window_){
        var defaultValue = "{ min: 5 }";
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        arrayInputHtml = '' +
            '<form name="form">' +
            '<span name="arrayVal" required-length="' + defaultValue +'" ng-model="array"></span>"' +
            '</form>';
        nomodelInputHtml = arrayInputHtml.replace('ng-model="array"', "");
        minMaxArrayInputHtml = arrayInputHtml.replace(defaultValue, "{ min: 5, max: 8 }");
        strictSizeArrayInputHtml = arrayInputHtml.replace(defaultValue, "5");
        requiredIfArrayInputHtml = arrayInputHtml.replace(defaultValue, "{ min: 5, requiredIf: 'model.isRequired' }")
        invalidRequiredLengthValueInputHtml = arrayInputHtml.replace(defaultValue, "'invalid'")
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

    it("should throw a validation error if array length is less than the min", function() {
        var element = createElement(arrayInputHtml);

        $rootScope.array = [1, 2, 3];
        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(true);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(true);

        $rootScope.array.push(4);
        $rootScope.array.push(5);
        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(false);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(false);

        $rootScope.array.push(6);
        $rootScope.array.push(7);
        $rootScope.$digest();

        expect($rootScope.form.arrayVal.$invalid).toBe(false);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(false);

    });

    it("should not add the validator config if the field does not have ngModel", function() {
        createElement(nomodelInputHtml);

        $rootScope.array = [1, 2, 3];
        $rootScope.$digest();
        expect($rootScope.form.$invalid).toBe(false);
    });

    it("should not add the validator config if provided requiredLength value is not valid", function() {
        createElement(invalidRequiredLengthValueInputHtml);

        $rootScope.array = [1, 2, 3];
        $rootScope.$digest();
        expect($rootScope.form.$invalid).toBe(false);
    });

    it("should throw a validation error if array length is less than the min or greater than the max", function() {
        var element = createElement(minMaxArrayInputHtml);

        $rootScope.array = [1, 2, 3];
        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(true);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(true);

        $rootScope.array.push(4);
        $rootScope.array.push(5);
        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(false);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(false);

        $rootScope.array.push(6);
        $rootScope.array.push(7);
        $rootScope.$digest();

        expect($rootScope.form.arrayVal.$invalid).toBe(false);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(false);

        $rootScope.array.push(8);
        $rootScope.array.push(9);
        $rootScope.$digest();

        expect($rootScope.form.arrayVal.$invalid).toBe(true);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(true);

        $rootScope.array.pop();
        $rootScope.$digest();

        expect($rootScope.form.arrayVal.$invalid).toBe(false);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(false);

    });

    it("should throw a validation error if array length does not equal the specified required length number", function() {
        var element = createElement(strictSizeArrayInputHtml);

        $rootScope.array = [1, 2, 3];
        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(true);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(true);

        $rootScope.array.push(4);
        $rootScope.array.push(5);
        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(false);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(false);

        $rootScope.array.push(6);
        $rootScope.array.push(7);
        $rootScope.$digest();

        expect($rootScope.form.arrayVal.$invalid).toBe(true);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(true);
    });

    it("should only throw the validation if the requiredIf field is true", function() {
        var element = createElement(requiredIfArrayInputHtml);

        $rootScope.array = [1, 2, 3];
        $rootScope.model = {
            isRequired: true
        };

        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(true);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(true);

        $rootScope.model.isRequired = false;
        $rootScope.$digest();
        expect($rootScope.form.arrayVal.$invalid).toBe(false);
        expect($rootScope.form.arrayVal.$error.requiredLength).toBe(false);

    });
});