'use strict';

describe("Unit Tests for Utility Service", function () {
    var utilSvc;
    beforeEach(function() {
        module('templates');
        module('app');
        inject(function(_util_){
            utilSvc = _util_;
        });
    });

    it('should generate uuid in the correct format', function(){
        var uuid = utilSvc.generateUUID();
        expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    });

    it('should get default fiscal year', function(){
        var fiscalYear = utilSvc.getFiscalYear();
        expect(fiscalYear).toBe(2016);
    });

    it('should get fiscal year from date', function(){
        var fiscalYear = utilSvc.getFiscalYear(new Date("2000-06-01"));
        expect(fiscalYear).toBe(2000);
    });

    it('should get next fiscal year from date on or after October', function() {
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

describe("Unit Tests for Microsoft Crypto Utility", function() {
    var utilSvc;
    beforeEach(function() {
        module('app');

        var $window = { crypto: null, msCrypto: { getRandomValues: function() { return Math.random().toString(36).substr(2); } } };
        module(function($provide) {
            $provide.value('$window', $window);
        });

        inject(function($injector) {
            utilSvc = $injector.get('util');
        });
    });

    it('should use msCrypto when crypto is null', function(){
        var uuid = utilSvc.generateUUID();
        expect(uuid).toBeDefined();
        expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    });
});

describe("Unit Tests for UUID Polyfill Utility", function() {
    var utilSvc;
    beforeEach(function() {
        module('app');

        var $window = { crypto: null, msCrypto: null };
        module(function($provide) {
            $provide.value('$window', $window);
        });

        inject(function($injector) {
            utilSvc = $injector.get('util');
        });
    });

    it('should use polyfill function when crypto is not available', function(){
        var uuid = utilSvc.generateUUID();
        expect(uuid).toBeDefined();
        expect(uuid).toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    });
});
