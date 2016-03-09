'use strict';

describe('Unit Tests for triggerClickOnEnter', function() {
    var $compile,
        $rootScope,
        $window,
        elementHtml,
        enterKey;

    beforeEach(inject(function(_$compile_, _$rootScope_, _$window_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $window = _$window_;
        elementHtml = '<a trigger-click-on-enter ng-click="counter = (counter + 1) || 0">Count</a>"';
        enterKey = 13;

        $window.angular.element.prototype.click = function() {};
    }));

    function createElement(){
        var element = $compile(elementHtml)($rootScope);
        $rootScope.$digest();

        return element;
    }

    function triggerKeyEvent(element, eventName, keyCode, keyCodeVariable) {
        keyCodeVariable = keyCodeVariable || "which";
        var event = {
            type: eventName
        };
        event[keyCodeVariable] = keyCode;
        element.triggerHandler(event);
    }

    function hasClass(element, cls) {
        return element.attr('class').split(' ').indexOf(cls) !== -1;
    }

    it("should add an active state when only the 'enter' key is held down", function() {
        var element = createElement();
        triggerKeyEvent(element, 'keydown', enterKey);
        expect(hasClass(element, 'active')).toBe(true);

        element = createElement();

        triggerKeyEvent(element, 'keydown', enterKey, 'keyCode');
        expect(hasClass(element, 'active')).toBe(true);
    });

    it("should not have an active state when any other key is held down", function(){
        var element = createElement();

        triggerKeyEvent(element, 'keydown', 40);
        expect(hasClass(element, 'active')).toBe(false);
    });

    it("should perform a click event when 'enter' key is pressed", function(){
        var element = createElement();
        spyOn(angular.element.prototype, 'click').and.callThrough();
        triggerKeyEvent(element, 'keydown', enterKey);
        expect(hasClass(element, 'active')).toBe(true);
        triggerKeyEvent(element, 'keyup', enterKey);
        expect(hasClass(element, 'active')).toBe(false);
        expect(element['click']).toHaveBeenCalled();
    });

    it("should accept the 'keycode' property for the event object", function(){
        var element = createElement();
        spyOn(angular.element.prototype, 'click').and.callThrough();

        triggerKeyEvent(element, 'keydown', enterKey, 'keyCode');
        expect(hasClass(element, 'active')).toBe(true);
        triggerKeyEvent(element, 'keyup', enterKey, 'keyCode');
        expect(hasClass(element, 'active')).toBe(false);
        expect(element['click']).toHaveBeenCalled()
    });

    it("should not perform a click event when any other key is pressed", function(){
        var element = createElement();
        spyOn(angular.element.prototype, 'click').and.callThrough();

        triggerKeyEvent(element, 'keydown', 40);
        expect(hasClass(element, 'active')).toBe(false);
        triggerKeyEvent(element, 'keyup', 40);
        expect(hasClass(element, 'active')).toBe(false);
        expect(element['click']).not.toHaveBeenCalled()
    });

    it("should remove the active state on blur after keydown", function(){
        var element = createElement();

        triggerKeyEvent(element, 'keydown', enterKey);
        expect(hasClass(element, 'active')).toBe(true);
        element.triggerHandler('blur');
        expect(hasClass(element, 'active')).toBe(false);
    });
});