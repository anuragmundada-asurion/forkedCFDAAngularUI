'use strict';

describe('Unit Tests for Public View FAL:', function () {
    beforeEach(module('app'));

    //dependencies to be injected
    var $rootScope,
        $httpBackend,
        $controller,
        UserService;

    beforeEach(function () {
        inject(function (_$rootScope_, _$controller_, _$httpBackend_,_UserService_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $httpBackend = _$httpBackend_;
            UserService = _UserService_;
        });

        UserService.changeUser({"roles": ["GSA_CFDA_R_cfdasuperuser"]});
    });

    describe('Controller Program Request:', function () {
        var scope;

        beforeEach(function(){
            scope = $rootScope.$new();

            //mock variable/function in scope
            scope = {
                ngDialogData:{
                    oEntity: {}
                }
            };
        });

        it('should initialize a program request variables', function () {
            $controller('ProgramRequestCtrl', {$scope: scope});

            expect(scope.oEntity).toBeDefined();
            expect(scope.modal).toBeDefined();
            expect(scope.initModal).toBeDefined();
            expect(scope.submitProgramRequest).toBeDefined();
            expect(scope.validateForm).toBeDefined();
            expect(scope.verifyProgramNumber).toBeDefined();
            expect(scope.getNextAvailableProgramNumber).toBeDefined();
            expect(scope.stringToJson).toBeDefined();
        });

        describe('Controller Program Request: Testing Function', function () {
            var $state, $timeout;

            beforeEach(function(){
                scope.ngDialogData = {
                    oEntity: {
                        id: 'bde3daabaf5f41ea986e6b421f78',
                        organizationId: '123321',
                    },
                    typeEntity: 'program_request',
                    action: 'agency_request'
                };
    
                scope.reason = 'need approval!';

                //program doesn't have any request
                $httpBackend.whenGET(/\/api\/programRequests\?completed=[\w]+\&program=bde3daabaf5f41ea986e6b421f78\&type=[\w\,]+/i).respond({
                    results: []
                });

                //program has request
                $httpBackend.whenGET(/\/api\/programRequests\?completed=[\w]+\&program=1233daabaf5f41ea986e6b421eee\&type=[\w\,]+/i).respond({
                    results: [{}]
                });

                //submit program request
                $httpBackend.whenPOST(/\/api\/programRequests/i).respond({});

                inject(function(_$state_, _$timeout_){
                    $state = _$state_;
                    $timeout = _$timeout_;
                });
            });

            it('Function initModal: Program request', function () {
                $controller('ProgramRequestCtrl', {$scope: scope});

                expect(scope.ngDialogData.typeEntity).toBeDefined();
                expect(scope.ngDialogData.typeEntity).toEqual('program_request');
                expect(scope.ngDialogData.action).toBeDefined();
                expect(scope.ngDialogData.action).toEqual('agency_request');
                expect(scope.organizationId).toBeDefined();
                expect(scope.organizationId).toEqual('123321');
            });

            it('Function initModal, Verify existing program requests (Nothing exist ...)', function () {
                $controller('ProgramRequestCtrl', {$scope: scope});

                scope.initModal();
                $httpBackend.flush();

                expect(scope.modal.show).toBeDefined();
                expect(scope.modal.show).toEqual(true);
            });

            it('Function initModal, Verify existing program requests (Request exists ...)', function () {
                scope.ngDialogData.oEntity.id = '1233daabaf5f41ea986e6b421eee';

                $controller('ProgramRequestCtrl', {$scope: scope});

                scope.initModal();
                $httpBackend.flush();

                expect(scope.modal.show).toBeDefined();
                expect(scope.modal.message).toBeDefined();
                expect(scope.modal.show).toEqual(false);
            });

            it('Function submitProgramRequest: programRequest/AgencyRequest Failure (Same Organization)', function () {
                $controller('ProgramRequestCtrl', {$scope: scope});
                scope.organizationId = scope.ngDialogData.oEntity.organizationId;

                spyOn(scope, 'validateForm');

                var result = scope.submitProgramRequest();

                expect(result).toEqual(false);
                expect(scope.validateForm).toHaveBeenCalled();
                expect(scope.submissionInProgress).toBeDefined();
                expect(scope.organizationError).toBeDefined();
                expect(scope.organizationError).toEqual(true);
            });

            it('Function submitProgramRequest: programRequest/AgencyRequest Success', function () {
                $controller('ProgramRequestCtrl', {$scope: scope});
                scope.organizationId = '1234321';

                spyOn(scope, 'validateForm');

                scope.submitProgramRequest();

                expect(scope.validateForm).toHaveBeenCalled();
                expect(scope.submissionInProgress).toBeDefined();
                
                $httpBackend.flush();

                spyOn($state, 'go');

                expect(scope.flash).toBeDefined();
                expect(scope.flash.type).toBeDefined();
                expect(scope.flash.message).toBeDefined();

                $timeout.flush();

                expect($state.go).toHaveBeenCalled();
            });

            it('Function submitProgramRequest: programRequest/TitleChangeRequest Failure', function () {
                scope.ngDialogData.action = 'title_request';

                $controller('ProgramRequestCtrl', {$scope: scope});

                spyOn(scope, 'validateForm');

                var result = scope.submitProgramRequest();

                expect(scope.validateForm).toHaveBeenCalled();
                expect(scope.submissionInProgress).toBeDefined();
                expect(result).toEqual(false);
            });

            it('Function submitProgramRequest: programRequest/TitleChangeRequest Success', function () {
                scope.ngDialogData.action = 'title_request';
                $controller('ProgramRequestCtrl', {$scope: scope});
                scope.newTitle = 'new title !';

                spyOn(scope, 'validateForm');

                scope.submitProgramRequest();

                expect(scope.validateForm).toHaveBeenCalled();
                expect(scope.submissionInProgress).toBeDefined();
                
                $httpBackend.flush();

                spyOn($state, 'go');

                expect(scope.flash).toBeDefined();
                expect(scope.flash.type).toBeDefined();
                expect(scope.flash.message).toBeDefined();

                $timeout.flush();

                expect($state.go).toHaveBeenCalled();
            });

            describe('Controller Program Request: Testing Function', function () {

                beforeEach(function(){
                    scope.ngDialogData = {
                        oEntity: {
                            id: 'bde3daabaf5f41ea986e6b421f78',
                            organizationId: '123321',
                            reason: 'Need approval!'
                        },
                        typeEntity: 'program_request_action',
                        action: 'agency'
                    };

                    //submit program request
                    $httpBackend.whenPOST(/\/api\/programRequestActions/i).respond({});

                    //get next available program number
                    $httpBackend.whenGET(/\/api\/programs\/nextAvailableProgramNumber\?organizationId=[\w]+/i).respond({
                        nextAvailableCode: 123,
                        isProgramNumberOutsideRange: true
                    });
                });

                it('Function initModal: Program Request Action', function () {

                    scope.organizationConfiguration = { programNumberAuto: false };

                    $controller('ProgramRequestCtrl', {$scope: scope});

                    expect(scope.ngDialogData.typeEntity).toBeDefined();
                    expect(scope.ngDialogData.typeEntity).toEqual('program_request_action');
                    expect(scope.ngDialogData.action).toBeDefined();
                    expect(scope.ngDialogData.action).toEqual('agency');
                    expect(scope.reason).toBeDefined();
                    expect(scope.reason).toEqual(scope.ngDialogData.oEntity.reason);

                    expect(scope.isProgramNumberUnique).toBeDefined();
                    expect(scope.isProgramNumberUnique).toEqual(false);
                    expect(scope.isProgramNumberValid).toBeDefined();
                    expect(scope.isProgramNumberValid).toEqual(false);
                });

                it('Function initModal: Program Request Action / Agency Change Request -> Maunal (Failure)', function () {
                    $controller('ProgramRequestCtrl', {$scope: scope});
                    
                    scope.organizationConfiguration = { programNumberAuto: false };
                    
                    $controller('ProgramRequestCtrl', {$scope: scope});

                    spyOn(scope, 'validateForm');

                    var result = scope.submitProgramRequest();

                    expect(scope.validateForm).toHaveBeenCalled();
                    expect(scope.submissionInProgress).toBeDefined();
                    expect(result).toEqual(false);
                });

                it('Function initModal: Program Request Action / Agency Change Request -> Maunal (Success)', function () {
                    $controller('ProgramRequestCtrl', {$scope: scope});

                    scope.isProgramNumberUnique = true;
                    scope.isProgramNumberValid = true;
                    scope.organizationConfiguration = { programNumberAuto: false };

                    spyOn(scope, 'validateForm');

                    scope.submitProgramRequest();

                    expect(scope.validateForm).toHaveBeenCalled();
                    expect(scope.submissionInProgress).toBeDefined();

                    $httpBackend.flush();
                    spyOn($state, 'go');

                    expect(scope.flash).toBeDefined();
                    expect(scope.flash.type).toBeDefined();
                    expect(scope.flash.message).toBeDefined();

                    $timeout.flush();

                    expect($state.go).toHaveBeenCalled();
                });

                it('Function initModal: Program Request Action / Agency Change Request -> Auto', function () {
                    $controller('ProgramRequestCtrl', {$scope: scope});

                    scope.organizationConfiguration = { programNumberAuto: true };
                    scope.oEntity.data = "{\"organizationId\": \"1234321\"}";
                    scope.getNextAvailableProgramNumber();
                    spyOn(scope, 'validateForm');

                    scope.submitProgramRequest();

                    expect(scope.validateForm).toHaveBeenCalled();
                    expect(scope.submissionInProgress).toBeDefined();

                    $httpBackend.flush();
                    spyOn($state, 'go');

                    expect(scope.flash).toBeDefined();
                    expect(scope.flash.type).toBeDefined();
                    expect(scope.flash.message).toBeDefined();
                    expect(scope.programNumber).toBeDefined();
                    expect(scope.isProgramNumberOutsideRange).toBeDefined();
                    expect(scope.programNumber).toEqual(123);
                    expect(scope.isProgramNumberOutsideRange).toEqual(true);

                    $timeout.flush();

                    expect($state.go).toHaveBeenCalled();
                });
            });
        });
    });
});