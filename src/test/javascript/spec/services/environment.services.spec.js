'use strict';

describe("Unit Tests for Environment Service", function () {
    var env;
    beforeEach(function() {
        module('app', function(envProvider) {
            env = envProvider.$get();
        });
    });

    it('should have default empty api', inject(function () {
        expect(env["pub.api.programs"]).toBe("");
    }));

    it('should have set api function', inject(function () {
        expect(env["setApi"]).toBeDefined();
    }));

    it('should set api parameter', inject(function () {
        env.setApi("Test API 1");
        expect(env["pub.api.programs"]).toBe("Test API 1");
    }));
});
