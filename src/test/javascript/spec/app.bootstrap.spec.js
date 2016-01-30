'use strict'

describe('Unit Tests for App Bootstrapping', function() {

    var envVariables = {
            'pub.api.programs': 'http://gsaiae-cfda-program-uat01.reisys.com/api/v1'
        },
        $httpBackend,
        $injector,
        $document,
        $timeout,
        bootstrap;

    beforeEach(function() {
        module('app.bootstrap');
        inject(function(_$httpBackend_, _$injector_, _$document_, _$timeout_, _bootstrap_) {
            $httpBackend = _$httpBackend_;
            $injector = _$injector_;
            $document = _$document_;
            $timeout = _$timeout_;
            bootstrap = _bootstrap_;

            $httpBackend
                .whenGET("/environment/api")
                .respond(envVariables);
        });
    });

    it("should have an empty 'env' constant object at the start", function() {
        expect(angular.injector(['app']).has('env')).toBe(false);
    });

    it("should load the server environment variables before bootstrapping the 'app' module", function(done) {
        expect(angular.element($document).injector()).toBeUndefined();
        bootstrap.run().finally(function(){
            var env = angular.injector(['app']).get('env');

            expect(env).toEqual(envVariables);

            angular.element($document).ready(function() {
                expect(angular.element($document).injector()).toBeDefined();
                done();
            });
        });
        $httpBackend.flush();
    });
});