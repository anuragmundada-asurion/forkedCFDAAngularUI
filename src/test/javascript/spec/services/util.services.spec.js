'use strict';

describe("Unit Tests for Utility Service", function () {
    var utilSvc;
    beforeEach(function() {
        module('app');
        inject(function(_util_){
            utilSvc = _util_;
        });
    });

    it('generate uuid in the correct format', function(){
        var uuid = utilSvc.generateUUID();
        expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    });

    it('get default fiscal year', function(){
        var fiscalYear = utilSvc.getFiscalYear();
        expect(fiscalYear).toBe(2016);
    });

    it('get fiscal year from date', function(){
        var fiscalYear = utilSvc.getFiscalYear(new Date("2000-06-01"));
        expect(fiscalYear).toBe(2000);
    });

    it('get next fiscal year from date on or after October', function() {
        var fiscalYear = utilSvc.getFiscalYear(new Date("10/10/2015"));
        expect(fiscalYear).toBe(2016);
    });

    it('should increment next id', function(){
        var id = utilSvc.nextId();
        expect(id).toBe(1);
        id = utilSvc.nextId();
        expect(id).toBe(2);
    });
});
