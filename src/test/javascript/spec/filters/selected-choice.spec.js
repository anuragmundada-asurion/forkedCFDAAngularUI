'use strict'

describe('Unit Tests for Filter: selectedChoice', function() {
    var choices,
        selected,
        propKey,
        selectedChoiceFilter;

    beforeEach(function(){
        module('app');
        propKey = 'id';

        //Create choices with the following schema: { letter: "string", id: "number" }
        //'id' is based on item's index + 1
        choices = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        for(var i = 0; i < choices.length; i++) {
            choices[i] = {
                letter: choices[i],
                id: i + 1
            };
        }

        selected = [3, 5, 8, 10, 20];

        inject(function(_$filter_) {
            selectedChoiceFilter = _$filter_('selectedChoiceFilter');
        });
    });


    it('should return an array of objects that match the key/value pairs between selected and choices arrays', function() {
        var result = selectedChoiceFilter(choices, selected, propKey),
            expectResult = expect(result);

        expectResult.toBeDefined();

        expectResult.toContain({
            id: 3,
            letter: 'c'
        });

        expectResult.toContain({
            id: 5,
            letter: 'e'
        });

        expectResult.toContain({
            id: 8,
            letter: 'h'
        });

        expectResult.toContain({
            id: 10,
            letter: 'j'
        });

        expect(result.length).toBe(4);
    });

    it('should return an empty array if the selected or choices args are not arrays', function() {
        expectToBeAnEmptyArray(selectedChoiceFilter(choices, null, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter(null, selected, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter(null, null, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter(choices, undefined, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter(undefined, selected, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter(choices, {}, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter({}, selected, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter(choices, 1, propKey));
        expectToBeAnEmptyArray(selectedChoiceFilter(1, selected, propKey));

        //////////

        function expectToBeAnEmptyArray(result){
            var expectResult = expect(result);
            expectResult.toBeDefined();
            expectResult.toEqual([]);
        }
    });
});