'use strict';

describe("Unit Tests for Program Routes", function () {
    var $state,
        $stateParams,
        $rootScope,
        $location,
        $injector,
        $timeout,
        $httpBackend,
        appConstants,
        coreChoices,
        program,
        User,
        UserService;

    function changeState(state, params) {
        $state.go(state, params);
        $rootScope.$digest();
    }

    beforeEach(function() {
        coreChoices = '{"yes_no":{"yes":{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},"no":{"element_id":"no","description":"No","value":"No","code":"no","elements":null}},"yes_na":{"yes":{"element_id":"yes","description":null,"value":"Yes","code":"yes","elements":null},"na":{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}},"yes_no_na":{"yes":{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},"no":{"element_id":"no","description":"No","value":"No","code":"no","elements":null},"na":{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}},"authorization_type":{"act":{"element_id":"act","description":null,"value":"Act","code":"act","elements":null},"eo":{"element_id":"eo","description":null,"value":"Executive Order","code":"eo","elements":null},"publiclaw":{"element_id":"publiclaw","description":null,"value":"Public Law","code":"publiclaw","elements":null},"statute":{"element_id":"statute","description":null,"value":"Statute","code":"statute","elements":null},"usc":{"element_id":"usc","description":null,"value":"USC","code":"usc","elements":null}}}';
        program = {"program":{"_id": "66d1d2645f8acd25c2e79bb60b7342da", "title": "0001 test Authorization", "organizationId": "REI Test Agency", "financial": {"accounts": [{"code": "12-1232-3-2-123", "description": "test"}, {"code": "12-1231-2-1-231", "description": "department of somethign"}, {"code": "13-2131-2-3-323"}], "treasury": {"tafs": [{"fy1": "2014", "fy2": "2016", "accountCode": "123-123-123123", "departmentCode": "12323", "subAccountCode": "q2123123", "allocationTransferAgency": "agency department o gkjsd kad"}, {"accountCode": "main code", "departmentCode": "test"}]}, "obligations": [{"values": {"2015": {"flag": "yes", "actual": "12312"}, "2016": {"flag": "yes", "estimate": "3231123"}, "2017": {"flag": "yes", "estimate": "dwqeq"}}, "questions": {"recovery": {"flag": "yes"}, "salary_or_expense": {"flag": "yes", "assistanceType": "0001003"}}, "additionalInfo": {"content": "asd ad ad asdad"}}, {"values": {"2015": {"flag": "na"}, "2016": {"flag": "na"}, "2017": {"flag": "yes"}}, "questions": {"recovery": {"flag": "na"}, "salary_or_expense": {"flag": "na"}}}]}, "relatedTo": [], "projectsArray": [], "authorizations": [{"act": {"part": "part 2", "title": "Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.", "section": "section"}, "active": true, "version": 1, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": true, "version": 1, "executiveOrder": {"part": "IXX", "title": "Establishing Paid sick leave", "section": "123123"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 1, "publicLaw": {"lawNumber": 123123, "congressCode": "110"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "statute": {"page": "32131231", "volume": "123"}, "version": 1, "authorizationId": "92adcf2e-7b91-e21b-9256-ba1e2421cc9d", "authorizationType": "statute"}, {"USC": {"title": "7 US", "section": "132123"}, "active": true, "version": 1, "authorizationId": "131f4e10-c8f5-7d15-2c5f-23a5ff890f14", "authorizationType": "usc"}, {"act": {"part": "qe", "title": "qweqew", "section": "qew"}, "active": false, "version": 2, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"act": {"part": "qeqwe", "title": "qewqw", "section": "qe"}, "active": true, "version": 3, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": false, "version": 2, "executiveOrder": {"part": "123", "title": "amend 1`", "section": "12312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "executiveOrder": {"part": "123", "title": "another amens", "section": "12312312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": false, "version": 2, "publicLaw": {"lawNumber": 123, "congressCode": "2312"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "publicLaw": {"lawNumber": 123, "congressCode": "1231231"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}], "alternativeNames": ["pop name"]}};
        module(function($provide) {
            $provide.value("Dictionary", {
                toDropdown: function() {
                    return {
                        $promise: coreChoices
                    }
                }
            });
            function Program() {}
            Program.get = function() {
                return {
                    $promise: program
                }
            };
            $provide.value("Program", Program);
        });
        inject(function(_$state_, _$stateParams_, _$rootScope_, _$location_, _$injector_, _$timeout_, _$httpBackend_, _appConstants_, _User_, _UserService_){
            $state = _$state_;
            $stateParams = _$stateParams_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $injector = _$injector_;
            $timeout = _$timeout_;
            $httpBackend = _$httpBackend_;
            appConstants = _appConstants_;
            User = _User_;
            UserService = _UserService_;
        });

        UserService.setUser({ "role": "GSA_CFDA_R_cfdasuperuser" });
    });

    it("should have the proper 'home' url", function(){
        //expect($state.href('home')).toEqual("#/"); HTML5 Mode OFF
        expect($state.href('home')).toEqual("/"); //HTML5 Mode ON
    });

    it("should have the proper 'addProgram' url", function() {
        //HTML5 Mode OFF
        //expect($state.href('addProgram', { section: 'info' })).toEqual('#/programs/add/info');
        //expect($state.href('addProgram', { section: 'review' })).toEqual('#/programs/add/review');

        //HTML5 Mode ON
        expect($state.href('addProgram', { section: 'info' })).toEqual('/programs/add/info');
        expect($state.href('addProgram', { section: 'review' })).toEqual('/programs/add/review');
    });

    it("should go to 'addProgram' state with a new program object and core dictionary choices", function(){
        $rootScope.$digest();
        //HTML5 Mode Off
        //goFrom('/#/').toState('addProgram', { section: 'info' });
        //HTML5 Mode ON
        changeState('addProgram', { section: 'info' });
        expect($state.is('addProgram')).toBe(true);
        expect($stateParams.section).toEqual("info");
    });

    it("should should have the proper 'editProgram' url", function() {
        //HTML5 Mode OFF
        //expect($state.href('editProgram', { id: '66d1d2645f8acd25c2e79bb60b7342da', section: 'info' }))
        //    .toEqual('#/programs/66d1d2645f8acd25c2e79bb60b7342da/edit/info');
        //expect($state.href('editProgram', { id: '4da0527af647322bf5e4b43bec7c6cef', section: 'review' }))
        //    .toEqual('#/programs/4da0527af647322bf5e4b43bec7c6cef/edit/review');
        //HTML5 Mode ON
        expect($state.href('editProgram', { id: '66d1d2645f8acd25c2e79bb60b7342da', section: 'info' }))
            .toEqual('/programs/66d1d2645f8acd25c2e79bb60b7342da/edit/info');
        expect($state.href('editProgram', { id: '4da0527af647322bf5e4b43bec7c6cef', section: 'review' }))
            .toEqual('/programs/4da0527af647322bf5e4b43bec7c6cef/edit/review');
    });


    it("should should have the proper 'viewProgram' url", function() {
        //HTML5 Mode OFF
        //expect($state.href('viewProgram', { id: '66d1d2645f8acd25c2e79bb60b7342da'}))
        //    .toEqual('#/programs/66d1d2645f8acd25c2e79bb60b7342da/view');
        //HTML5 Mode ON
        expect($state.href('viewProgram', { id: '66d1d2645f8acd25c2e79bb60b7342da'}))
            .toEqual('/programs/66d1d2645f8acd25c2e79bb60b7342da/view');
    });

    it("should should have the proper 'previewProgram' url", function() {
        //HTML5 Mode OFF
        //expect($state.href('previewProgram', { id: '66d1d2645f8acd25c2e79bb60b7342da'}))
        //    .toEqual('#/programs/66d1d2645f8acd25c2e79bb60b7342da/preview');
        //HTML5 Mode ON
        expect($state.href('previewProgram', { id: '66d1d2645f8acd25c2e79bb60b7342da'}))
            .toEqual('/programs/66d1d2645f8acd25c2e79bb60b7342da/preview');
    });

    it("should go to 'editProgram' state with an existing program object and core dictionary choices", function(){
        $rootScope.$digest();
        var id = '66d1d2645f8acd25c2e79bb60b7342da';
        //HTML5 Mode OFF
        //goFrom('/#/').toState('editProgram', { id: id, section: 'info' });
        //HTML5 Mode On
        changeState('editProgram', { id: id, section: 'info' });
        expect($state.is('editProgram')).toBe(true);
        expect($stateParams.id).toEqual(id);
        expect($stateParams.section).toEqual("info");
    });
});