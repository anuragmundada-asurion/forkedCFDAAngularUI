'use strict'

describe('Unit Tests for Filter: related programs', function() {
    var relatedFilter;
    var testPrograms;

    beforeEach(function(){
        module('app');
        inject(function(_$filter_) {
            testPrograms = [{id:1, title: "Test Title", status: 'Published'}, {id:2, programNumber: "Test Program Number", status: 'Published'}, {id: 3, title: "Test Both", programNumber: "Test Both", status: 'Published'}];
            relatedFilter = _$filter_('searchRelatedPrograms');
        });
    });

    it('should immediately return if no data is provided', function() {
        expect(relatedFilter(null, "Test")).toBe(undefined);
    });

    it('should return all the programs when searching on nothing', function() {
        expect(relatedFilter(testPrograms, "")).toEqual(testPrograms);
    });

    it('should return matching titles', function() {
        expect(relatedFilter(testPrograms, "Title")).toEqual([testPrograms[0]]);
    });

    it('should return matching program numbers', function() {
        expect(relatedFilter(testPrograms, "Program")).toEqual([testPrograms[1]]);
    });
});