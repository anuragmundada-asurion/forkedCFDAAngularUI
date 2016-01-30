'use strict';

describe("Unit Tests for HTTP Code Routes", function () {
    var $window, $state, $rootScope, $location, $templateCache, $httpBackend;

    function mockTemplate(templateRoute, tpl) {
        $templateCache.put(templateRoute, tpl || templateRoute);
        $httpBackend.expectGET(templateRoute);
    }

    function goTo(url) {
        $location.url(url);
        $rootScope.$digest();
    }

    beforeEach(function() {
        module('app');
        inject(function(_$window_, _$state_, _$rootScope_, _$location_, _$templateCache_, _$httpBackend_){
            $window = _$window_;
            $state = _$state_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $templateCache = _$templateCache_;
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET('/environment/api').respond('Test API');

            $httpBackend.expectGET('/environment/api');

            mockTemplate('partials/httpcode/404.tpl.html');
        });
    });

    it('should go to 404 state if route is undefined', function(){
        goTo('/NoPath');
        expect($state.is('404')).toBe(true);
    });
});