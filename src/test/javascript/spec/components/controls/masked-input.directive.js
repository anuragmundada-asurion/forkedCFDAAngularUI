'use strict';

describe('Unit Tests for the maskedInput directive', function() {
    var $document,
        $compile,
        $rootScope,
        $timeout,
        mask,
        maskInputFieldLength,
        html;

    beforeEach(inject(function(_$document_,_$compile_, _$rootScope_, _$timeout_){
        $document = _$document_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        mask = 'xxx-xxxx-xx';
        maskInputFieldLength = mask.split('-').length;
        html = '' +
            "<form name='form'>" +
                "<masked-input mask='" + mask + "' ng-model='value'></masked-input>" +
            "</form>";
    }));

    function createElement(){
        var element = $compile(html)($rootScope);
        $rootScope.$digest();
        return element
    }


    it("should have an n number of input fields depending of mask (ex. xxx-xxxx-xx should be three after spliting string by '-')", function() {
        var element = createElement();

        expect(element.find('input').length).toBe(maskInputFieldLength);
    });

    it("should set the proper model value upon input)", function() {
        var element = createElement();

        angular.element(element.find('input')[0]).val('123').triggerHandler('keydown');
        $timeout.flush();
        $rootScope.$digest();
        expect($rootScope.value).toBe('123-____-__');

        angular.element(element.find('input')[1]).val('456').triggerHandler('keydown');
        $timeout.flush();
        $rootScope.$digest();
        expect($rootScope.value).toBe('123-456_-__');

        angular.element(element.find('input')[1]).val('4567').triggerHandler('keydown');
        $timeout.flush();
        $rootScope.$digest();
        angular.element(element.find('input')[2]).val('89').triggerHandler('keydown');
        $timeout.flush();
        $rootScope.$digest();
        expect($rootScope.value).toBe('123-4567-89');

    });
});