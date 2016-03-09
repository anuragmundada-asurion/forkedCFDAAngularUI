'use strict';

describe('Unit Tests for the multi-entry directives', function() {
    var $document,
        $compile,
        $rootScope,
        $timeout,
        shellUiHtml;

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
        $rootScope.vm = {};
        $rootScope.vm.choices = choices;
        $rootScope.vm.selected = [];

        shellUiHtml = '' +
            "<form name='form'>" +
                "<multi-entry ng-model='vm.items' name='items' editable-items='true' new-entry-btn-name='+ Add Item' delete-btn-label='Delete Items' parent-vm='vm'>"
            "</form>";
    }));

    function createElement(attrs){
        var element = angular.element(shellUiHtml);
        if(attrs)
            element.find('multi-entry').attr(attrs);
        var element = $compile(element)($rootScope);
        $rootScope.$digest();
        return {
            component: element,
            scope: element.find('multi-entry').find('div').scope()
        };
    }

    describe("Unit Tests for the multiEntry directive", function() {
        it("should have global functions and variables on controller defined", function(){
            var element = createElement(),
                controller = element.scope.$ctrl;

            expect(controller.deleteEntry).toBeDefined();
            expect(controller.allowModifications).toBeDefined();
            expect(controller.openEntryDialog).toBeDefined();
            expect(controller.closeEntryDialog).toBeDefined();
            expect(controller.initOpenAddEntryDialog).toBeDefined();
            expect(controller.initOpenEditEntryDialog).toBeDefined();
            expect(controller.initAfterDialogOpen).toBeDefined();
        })
    });
});