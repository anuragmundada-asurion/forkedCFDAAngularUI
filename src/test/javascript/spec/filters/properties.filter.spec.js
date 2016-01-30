describe('Unit Tests for Filter: propsFilter', function() {
    var choices,
        marryChoice,
        tomChoice,
        tonyChoice,
        georgeChoice,
        propsFilter;

    beforeEach(function(){
        module('app');
        inject(function(_$filter_) {
            marryChoice = {
                name: 'Marry',
                age: 24,
                parent: {
                    name: "Bill"
                }
            };
            tomChoice = {
                name: 'Tom',
                age: 36,
                parent: {
                    name: "Bob"
                }
            };
            tonyChoice = {
                name: 'Tony',
                age: 36,
                parent: {
                    name: "Laura"
                }
            };
            georgeChoice = {
                name: 'George',
                age: 50,
                parent: {
                    name: "Tina"
                }
            };
            choices = [marryChoice, tomChoice, tonyChoice, georgeChoice];
            propsFilter = _$filter_('propsFilter');
        });
    });


    it('should return a list of items based on search criteria', function() {
        var expectResult = expect(propsFilter(choices, { age: 36 }));
        expectResult.toContain(tomChoice);
        expectResult.toContain(tonyChoice);
        expectResult.not.toContain(marryChoice);
        expectResult.not.toContain(georgeChoice);

        expectResult = expect(propsFilter(choices, { name: "y"}));
        expectResult.toContain(marryChoice);
        expectResult.toContain(tonyChoice);
        expectResult.not.toContain(georgeChoice);
        expectResult.not.toContain(tomChoice);

        expectResult = expect(propsFilter(choices, { 'parent.name': "b" }));
        expectResult.toContain(marryChoice);
        expectResult.toContain(tomChoice);
        expectResult.not.toContain(georgeChoice);
        expectResult.not.toContain(tonyChoice);

        expectResult = expect(propsFilter(choices, { age: 50 }));
        expectResult.toContain(georgeChoice);
        expectResult.not.toContain(tomChoice);
        expectResult.not.toContain(tonyChoice);
        expectResult.not.toContain(marryChoice);
    });

    it('should return results if search criteria matches one or more properties', function() {
        var expectResult = expect(propsFilter(choices, { age: 36, name: "Marry" }));
        expectResult.toContain(tomChoice);
        expectResult.not.toContain(georgeChoice);
        expectResult.toContain(tonyChoice);
        expectResult.toContain(marryChoice);
    });

    it('should return an empty array if search criteria was not met', function() {
        expect(propsFilter(choices, { age: 1 })).toEqual([]);
        expect(propsFilter(choices, { name: 'Greg' })).toEqual([]);
        expect(propsFilter(choices, { 'parent.name': 'Ed'})).toEqual([]);
    });

    it('should return all items if search criteria is not an object', function() {
        expect(propsFilter(choices, null)).toEqual(choices);
        expect(propsFilter(choices, undefined)).toEqual(choices);
    });

    it('should return all items if search criteria object is empty', function() {
        expect(propsFilter(choices, {})).toEqual(choices);
    });
});