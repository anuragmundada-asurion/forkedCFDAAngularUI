'use strict';

describe('Unit Tests for Historical Index View Controller:', function () {
    //load app
    beforeEach(module('app'));

    //dependencies to be injected
    var $rootScope,
        $httpBackend,
        $controller,
        $state,
        $stateParams,
        User,
        UserService;
    var testHistoricalIndexId = "cd88fc26cb9221996df5b29833f87a7a";
    var testProgramId = "0079904b019ff3232a8f188c7045ce6d";

    //helper function
    function changeState(state, params) {
        $state.go(state, params);
        $rootScope.$digest();
    }

    beforeEach(function () {
        inject(function (_$rootScope_, _$controller_, _$httpBackend_,_$state_,_$stateParams_,_User_,_UserService_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            $state = _$state_;
            $stateParams = _$stateParams_;
            User = _User_;
            UserService = _UserService_;
        });
        UserService.setUser({"role": "GSA_CFDA_R_cfdasuperuser"});//user must be able to access view
        var responseJSON = "{\"id\":\"cd88fc26cb9221996df5b29833f87a7a\",\"organizationId\":\"100006809\",\"fiscalYear\":1981,\"statusCode\":\"U\",\"changeDescription\":\"Animal Health and Disease Research\",\"reason\":null,\"actionType\":\"publish\",\"programNumber\":\"10.207\",\"index\":1,\"createdDate\":null,\"isManual\":\"1\"}";
        $httpBackend.whenGET('/api/historicalChange/'+testHistoricalIndexId).respond(responseJSON);
    });

    describe('Controller Historical Index List:', function () {
        var scope;

        beforeEach(function(){
            scope = $rootScope.$new();

        });

        it('authorized historical index View api call', function () {
            //console.log($rootScope.user);
            changeState('viewHistoricalIndex', {hid: testHistoricalIndexId, pid: testProgramId});
            //console.log($state.current);
            expect($state.is('viewHistoricalIndex')).toBe(true);
            expect($stateParams.hid).toEqual(testHistoricalIndexId);
        });

        it('unauthorized historical index View api call', function () {
            UserService.setUser({"role": "GSA_CFDA_R_agency_submitter"});//user should not be able to access view
            changeState('viewHistoricalIndex', {hid: testHistoricalIndexId, pid: testProgramId});
            expect($state.is('viewHistoricalIndex')).toBe(false);
        });

    });
});