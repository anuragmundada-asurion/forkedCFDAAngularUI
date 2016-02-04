'use strict';

describe("Unit Tests for Dictionary Service", function () {
    var $httpBackend, dictionarySvc;
    beforeEach(function() {
        module('app');

        var env = {'pub.api.programs': '/api', 'setApi': function(){}};
        module(function($provide) {
            $provide.value('env', env);
        });

        inject(function(_$httpBackend_, _Dictionary_){
            $httpBackend = _$httpBackend_;
            dictionarySvc = _Dictionary_;
        });
    });

    describe("Testing for Dictionary retrieval", function() {
        it('should make a get call to retrieve a single special dictionary', function() {
            $httpBackend
                .whenGET('/api/dictionaries?ids=yes_na')
                .respond('[{"id":"yes_na","elements":[{"element_id":"yes","description":null,"value":"Yes","code":"yes","elements":null},{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}]}]');
            var dictionary = dictionarySvc.toDropdown({ ids: 'yes_na' });
            $httpBackend.flush();
            expect(dictionary).toBeDefined();
        });

        it('should make a get call to retrieve a multiple special dictionary', function() {
            $httpBackend
                .whenGET('/api/dictionaries?ids=yes_na,yes_no,yes_no_na,authorization_type')
                .respond('[{"id":"yes_na","elements":[{"element_id":"yes","description":null,"value":"Yes","code":"yes","elements":null},{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}]},{"id":"yes_no","elements":[{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},{"element_id":"no","description":"No","value":"No","code":"no","elements":null}]},{"id":"yes_no_na","elements":[{"element_id":"yes","description":"Yes","value":"Yes","code":"yes","elements":null},{"element_id":"no","description":"No","value":"No","code":"no","elements":null},{"element_id":"na","description":"Not Applicable","value":"Not Applicable","code":"na","elements":null}]},{"id":"authorization_type","elements":[{"element_id":"act","description":null,"value":"Act","code":"act","elements":null},{"element_id":"eo","description":null,"value":"Executive Order","code":"eo","elements":null},{"element_id":"publiclaw","description":null,"value":"Public Law","code":"publiclaw","elements":null},{"element_id":"statute","description":null,"value":"Statute","code":"statute","elements":null},{"element_id":"usc","description":null,"value":"USC","code":"usc","elements":null}]}]');
            var dictionaries = dictionarySvc.toDropdown({ ids: ['yes_na', 'yes_no', 'yes_no_na', 'authorization_type'].join(',') });
            $httpBackend.flush();
            expect(dictionaries).toBeDefined();
            expect(dictionaries['yes_na']).toBeDefined();
            expect(dictionaries['yes_no']).toBeDefined();
        });

        it('should make a get call to retrieve a multiple regular dictionary', function() {
            $httpBackend
                .whenGET('/api/dictionaries?ids=functional_codes,assistance_type')
                .respond('[{"id":"functional_codes","elements":[{"element_id":"0001","description":null,"value":"AGRICULTURAL","code":null,"elements":[{"element_id":"0001001","description":null,"value":"Resource Conservation and Development","code":"AK","elements":null}]},{"element_id":"0002","description":null,"value":"BUSINESS AND COMMERCE","code":null,"elements":[{"element_id":"0002001","description":null,"value":"Small Business","code":"BK","elements":null}]}]},{"id":"assistance_type","elements":[{"element_id":"0001","description":"Formula Grants - Allocations of money to States or their subdivisions in accordance with a distribution formula prescribed by law or administrative regulation, for activities of a continuing nature not confined to a specific project.","value":"FORMULA GRANTS","code":"A","elements":[{"element_id":"0001001","description":null,"value":"Formula Grants","code":"A","elements":null}]},{"element_id":"0003","description":"Project Grants - The funding, for fixed or known periods, of specific projects or the delivery of specific services or products without liability for damages for failure to perform. Project grants include fellowships, scholarships, research grants, training grants, traineeships, experimental and demonstration grants, evaluation grants, planning grants, technical assistance grants, survey grants, construction grants, and unsolicited contractual agreements.","value":"PROJECT GRANTS","code":"B","elements":[{"element_id":"0003001","description":null,"value":"Cooperative Agreements","code":"B","elements":null}]}]}]');
            var dictionaries = dictionarySvc.toDropdown({ ids: ['functional_codes','assistance_type'].join(',') });
            $httpBackend.flush();
            expect(dictionaries).toBeDefined();
            expect(dictionaries['functional_codes']).toBeDefined();
            expect(dictionaries['assistance_type']).toBeDefined();
        });
        it('should make a GET call to retrieve a multiple regular dictionary in a tree format', function() {
            $httpBackend
                .whenGET('http://gsaiae-cfda-program-uat01.reisys.com/api/v1/dictionaries?ids=functional_codes,assistance_type')
                .respond('[{"id":"functional_codes","elements":[{"element_id":"0001","description":null,"value":"AGRICULTURAL","code":null,"elements":[{"element_id":"0001001","description":null,"value":"Resource Conservation and Development","code":"AK","elements":null}]},{"element_id":"0002","description":null,"value":"BUSINESS AND COMMERCE","code":null,"elements":[{"element_id":"0002001","description":null,"value":"Small Business","code":"BK","elements":null}]}]},{"id":"assistance_type","elements":[{"element_id":"0001","description":"Formula Grants - Allocations of money to States or their subdivisions in accordance with a distribution formula prescribed by law or administrative regulation, for activities of a continuing nature not confined to a specific project.","value":"FORMULA GRANTS","code":"A","elements":[{"element_id":"0001001","description":null,"value":"Formula Grants","code":"A","elements":null}]},{"element_id":"0003","description":"Project Grants - The funding, for fixed or known periods, of specific projects or the delivery of specific services or products without liability for damages for failure to perform. Project grants include fellowships, scholarships, research grants, training grants, traineeships, experimental and demonstration grants, evaluation grants, planning grants, technical assistance grants, survey grants, construction grants, and unsolicited contractual agreements.","value":"PROJECT GRANTS","code":"B","elements":[{"element_id":"0003001","description":null,"value":"Cooperative Agreements","code":"B","elements":null}]}]}]');
            var dictionaries = dictionarySvc.query({ ids: ['functional_codes','assistance_type'].join(',') });
            $httpBackend.flush();
            expect(dictionaries).toBeDefined();
            expect(dictionaries['functional_codes']).toBeDefined();
            expect(dictionaries['assistance_type']).toBeDefined();
            expect(dictionaries['functional_codes'][0].elements).toBeDefined();
            expect(dictionaries['assistance_type'][0].elements).toBeDefined()
            expect(dictionaries['functional_codes'][0].displayValue).toBeDefined();
            expect(dictionaries['assistance_type'][0].displayValue).toBeDefined();
        });
        it('should return an empty object for invalid dictionaries', function() {
            $httpBackend
                .whenGET('/api/dictionaries?ids=invalid_dictionary')
                .respond('[{}]');
            var response = dictionarySvc.toDropdown({ ids: 'invalid_dictionary' });
            $httpBackend.flush();
            expect(response).toBeDefined();
            expect(response['invalid_dictionary']).not.toBeDefined();
        });

        it('should return an empty object for no dictionaries', function() {
            $httpBackend
                .whenGET('/api/dictionaries?ids=no_dictionary')
                .respond('[]');
            var response = dictionarySvc.toDropdown({ ids: 'no_dictionary' });
            $httpBackend.flush();
            expect(response).toBeDefined();
        });
    });
});
