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

                //program has request
                $httpBackend.whenPOST(/\/api\/programRequests/i).respond({});

                inject(function(_$state_, _$timeout_){
                    $state = _$state_;
                    $timeout = _$timeout_;
                });
            });

            it('Function initModal', function () {
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

                scope.submitProgramRequest();

                expect(scope.validateForm).toHaveBeenCalled();
                expect(scope.submissionInProgress).toBeDefined();
                expect(scope.organizationError).toBeDefined();
                expect(scope.organizationError).toEqual(true);
            });

            it('Function submitProgramRequest: programRequest/AgencyRequest Failure (Different Organization)', function () {
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
        });

//        it('should initialize a program request function', function () {
//            $controller('ProgramRequestCtrl', { $scope: scope });
//            
//            spyOn(scope, 'initModal').and.callThrough();
//
//            expect(scope.initModal).toHaveBeenCalled();
//        });
    });
});