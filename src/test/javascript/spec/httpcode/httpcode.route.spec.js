'use strict';

describe("Unit Tests for HTTP Code Routes", function () {
    var $window, $state, $rootScope, $location, $templateCache, $httpBackend;

    function goTo(url) {
        $location.url(url);
        $rootScope.$digest();
    }

    beforeEach(function() {
        inject(function(_$window_, _$state_, _$rootScope_, _$location_, _$templateCache_, _$httpBackend_){
            $window = _$window_;
            $state = _$state_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $templateCache = _$templateCache_;
            $httpBackend = _$httpBackend_;
        });
    });

    it('should go to 404 state if route is undefined', function(){
        goTo('/NoPath');
        expect($state.is('404')).toBe(true);
    });
});