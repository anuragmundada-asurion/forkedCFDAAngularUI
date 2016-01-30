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
        coreChoices;

    function goFrom(url) {
        return {toState: function (state, params) {
            $location.replace().url(url);
            $state.go(state, params);
            $rootScope.$digest();
        }};
    }

    beforeEach(function() {
        coreChoices = '{"yes_no":{"yes":{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},"no":{"element_id":"no","description":"No","value":"No","code":"no","elements":null}},"yes_na":{"yes":{"element_id":"yes","description":null,"value":"Yes","code":"yes","elements":null},"na":{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}},"yes_no_na":{"yes":{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},"no":{"element_id":"no","description":"No","value":"No","code":"no","elements":null},"na":{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}},"authorization_type":{"act":{"element_id":"act","description":null,"value":"Act","code":"act","elements":null},"eo":{"element_id":"eo","description":null,"value":"Executive Order","code":"eo","elements":null},"publiclaw":{"element_id":"publiclaw","description":null,"value":"Public Law","code":"publiclaw","elements":null},"statute":{"element_id":"statute","description":null,"value":"Statute","code":"statute","elements":null},"usc":{"element_id":"usc","description":null,"value":"USC","code":"usc","elements":null}}}';
        module('app');
        module(function($provide) {
            $provide.value("Dictionary", {
                toDropdown: function() {
                    return {
                        $promise: coreChoices
                    }
                }
            });
        });
        module('templates');
        inject(function(_$state_, _$stateParams_, _$rootScope_, _$location_, _$injector_, _$timeout_, _$httpBackend_, _appConstants_){
            $state = _$state_;
            $stateParams = _$stateParams_;
            $rootScope = _$rootScope_;
            $location = _$location_;
            $injector = _$injector_;
            $timeout = _$timeout_;
            $httpBackend = _$httpBackend_;
            appConstants = _appConstants_;
        });
    });

    it("should respond to the 'addProgram' url", function() {
        expect($state.href('addProgram', { section: 'info' })).toEqual('#/programs/add/info');
    });

    it("should go to 'addProgram' state with a new program object and core dictionary choices", function(){

        goFrom('/#/').toState('addProgram', { section: 'info' });
        expect($state.is('addProgram')).toBe(true);
        expect($stateParams.section).toBe("info");
        console.log($state.current.resolve.coreChoices);
        expect(($injector.invoke($state.current.resolve.program))).toBeDefined();
        expect($injector.invoke($state.current.resolve.coreChoices)).toEqual(coreChoices);
    });
});