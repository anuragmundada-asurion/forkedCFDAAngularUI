'use strict';

describe('Unit Tests for the uxAdvMultiSelect directive', function() {
    var $document,
        $compile,
        $rootScope,
        $timeout,
        html;

    beforeEach(inject(function(_$document_,_$compile_, _$rootScope_, _$timeout_){
        $document = _$document_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
        var choices = ['apple', 'bus', 'car', 'door', 'elevator', 'floor', 'goal', 'house', 'igloo', 'job',
            'kool', 'live', 'mic', 'noise', 'open', 'pot', 'queen', 'rob', 'save', 'time'];
        for(var i = 0; i < choices.length; i++) {
            choices[i] = {
                title: choices[i],
                id: i + 1
            };
        }
        $rootScope.choices = choices;
        $rootScope.selected = [];

        html = '' +
            "<form name='form'>" +
                "<ux-adv-multi-select " +
                    "ng-model='selected' " +
                    "ux-choices='choices' " +
                    "ux-choice-value='id' " +
                    "ux-choice-title='title' " +
                    "ux-items-per-page='5' " +
                    "ux-displayed-pages='2' " +
                "></ux-adv-multi-select>" +
            "</form>";
    }));

    function createElement(attrs){
        var element = angular.element(html);
        if(attrs)
            element.find('ux-adv-multi-select').attr(attrs);
        var element = $compile(element)($rootScope);
        $timeout.flush();
        $rootScope.$digest();
        return {
            component: element,
            scope: element.find('ux-adv-multi-select').scope()
        };
    }


    it("should have controller on scope", function() {
        var element = createElement();
        expect(element.scope._ctrl).toBeDefined();
    });
    it("should be able to add items to the ngModel variable", function() {
        var element = createElement(),
            choiceA = $rootScope.choices[2],
            choiceB = $rootScope.choices[5]

        element.scope._ctrl.add(choiceA);
        element.scope._ctrl.add(choiceB);

        expect($rootScope.selected).toContain(choiceA.id);
        expect($rootScope.selected).toContain(choiceB.id);

    });

    it("should be able to remove items to the ngModel variable", function() {
        var element = createElement(),
            choiceB = $rootScope.choices[5];

        $rootScope.selected.push(6);
        $rootScope.selected.push(8);

        element.scope._ctrl.remove(choiceB);

        expect($rootScope.selected).not.toContain(choiceB.id);
        expect($rootScope.selected.length).toBe(1);

    });

    it("should have a search input if the filter attribute has been supplied", function() {
        var element = createElement({
            'ux-search-filter': "filter: {value: srchText }"
        });
        expect(element.component.find('ux-search-container').length).toBe(1);
    });
});