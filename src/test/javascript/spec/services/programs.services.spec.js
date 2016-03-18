'use strict';

describe("Unit Tests for Programs Service", function () {
    var $httpBackend, programsSvc;
    beforeEach(function() {
        inject(function(_$httpBackend_, _ProgramFactory_){
            $httpBackend = _$httpBackend_;
            programsSvc = _ProgramFactory_;
        });
    });

    describe("Testing for individual Program retrieval", function() {
        it('should make a get call to retrieve program object', function() {
            $httpBackend
                .whenGET('/api/programs/testID')
                .respond('{"id": "bde3daabaf5f41ea986e6b421f78", "data":{"_id": "bde3daabaf5f41ea986e6b421f78", "title": "0001 test Authorization", "agencyId": "REI Test Agency", "financial": {"accounts": [{"code": "12-1232-3-2-123", "description": "test"}, {"code": "12-1231-2-1-231", "description": "department of somethign"}, {"code": "13-2131-2-3-323"}], "treasury": {"tafs": [{"fy1": "2014", "fy2": "2016", "accountCode": "123-123-123123", "departmentCode": "12323", "subAccountCode": "q2123123", "allocationTransferAgency": "agency department o gkjsd kad"}, {"accountCode": "main code", "departmentCode": "test"}]}, "obligations": [{"values": {"2015": {"flag": "yes", "actual": "12312"}, "2016": {"flag": "yes", "estimate": "3231123"}, "2017": {"flag": "yes", "estimate": "dwqeq"}}, "questions": {"recovery": {"flag": "yes"}, "salary_or_expense": {"flag": "yes", "assistanceType": "0001003"}}, "additionalInfo": {"content": "asd ad ad asdad"}}, {"values": {"2015": {"flag": "na"}, "2016": {"flag": "na"}, "2017": {"flag": "yes"}}, "questions": {"recovery": {"flag": "na"}, "salary_or_expense": {"flag": "na"}}}]}, "relatedTo": [], "projectsArray": [], "authorizations": [{"act": {"part": "part 2", "title": "Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.", "section": "section"}, "active": true, "version": 1, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": true, "version": 1, "executiveOrder": {"part": "IXX", "title": "Establishing Paid sick leave", "section": "123123"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 1, "publicLaw": {"lawNumber": 123123, "congressCode": "110"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "statute": {"page": "32131231", "volume": "123"}, "version": 1, "authorizationId": "92adcf2e-7b91-e21b-9256-ba1e2421cc9d", "authorizationType": "statute"}, {"USC": {"title": "7 US", "section": "132123"}, "active": true, "version": 1, "authorizationId": "131f4e10-c8f5-7d15-2c5f-23a5ff890f14", "authorizationType": "usc"}, {"act": {"part": "qe", "title": "qweqew", "section": "qew"}, "active": false, "version": 2, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"act": {"part": "qeqwe", "title": "qewqw", "section": "qe"}, "active": true, "version": 3, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": false, "version": 2, "executiveOrder": {"part": "123", "title": "amend 1`", "section": "12312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "executiveOrder": {"part": "123", "title": "another amens", "section": "12312312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": false, "version": 2, "publicLaw": {"lawNumber": 123, "congressCode": "2312"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "publicLaw": {"lawNumber": 123, "congressCode": "1231231"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}], "alternativeNames": ["pop name"]}}');
            var program = programsSvc.get({id: "testID"});
            $httpBackend.flush();
            expect(program).toBeDefined();
        });

        it('should make a populate _id field if none is sent back', function() {
            $httpBackend
                .whenGET('/api/programs/testID')
                .respond('{"id": "bde3daabaf5f41ea986e6b421f78", "data":{"_id": "bde3daabaf5f41ea986e6b421f78", "title": "0001 test Authorization", "agencyId": "REI Test Agency", "financial": {"accounts": [{"code": "12-1232-3-2-123", "description": "test"}, {"code": "12-1231-2-1-231", "description": "department of somethign"}, {"code": "13-2131-2-3-323"}], "treasury": {"tafs": [{"fy1": "2014", "fy2": "2016", "accountCode": "123-123-123123", "departmentCode": "12323", "subAccountCode": "q2123123", "allocationTransferAgency": "agency department o gkjsd kad"}, {"accountCode": "main code", "departmentCode": "test"}]}, "obligations": [{"values": {"2015": {"flag": "yes", "actual": "12312"}, "2016": {"flag": "yes", "estimate": "3231123"}, "2017": {"flag": "yes", "estimate": "dwqeq"}}, "questions": {"recovery": {"flag": "yes"}, "salary_or_expense": {"flag": "yes", "assistanceType": "0001003"}}, "additionalInfo": {"content": "asd ad ad asdad"}}, {"values": {"2015": {"flag": "na"}, "2016": {"flag": "na"}, "2017": {"flag": "yes"}}, "questions": {"recovery": {"flag": "na"}, "salary_or_expense": {"flag": "na"}}}]}, "relatedTo": [], "projectsArray": [], "authorizations": [{"act": {"part": "part 2", "title": "Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.Animal Welfare Act, as amended, 7 U.S.C 2131-2155; Plant Protection Act, Public Law 106-224, 7 U.S.C 7701-7772; Farm Security and Rural Investment Act of 2002, Public Law 107-171, E U.S.C 10401-10418.", "section": "section"}, "active": true, "version": 1, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": true, "version": 1, "executiveOrder": {"part": "IXX", "title": "Establishing Paid sick leave", "section": "123123"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 1, "publicLaw": {"lawNumber": 123123, "congressCode": "110"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "statute": {"page": "32131231", "volume": "123"}, "version": 1, "authorizationId": "92adcf2e-7b91-e21b-9256-ba1e2421cc9d", "authorizationType": "statute"}, {"USC": {"title": "7 US", "section": "132123"}, "active": true, "version": 1, "authorizationId": "131f4e10-c8f5-7d15-2c5f-23a5ff890f14", "authorizationType": "usc"}, {"act": {"part": "qe", "title": "qweqew", "section": "qew"}, "active": false, "version": 2, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"act": {"part": "qeqwe", "title": "qewqw", "section": "qe"}, "active": true, "version": 3, "authorizationId": "5d7386d0-9a4f-f0ab-5599-fe09e5ff031b", "authorizationType": "act"}, {"active": false, "version": 2, "executiveOrder": {"part": "123", "title": "amend 1`", "section": "12312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "executiveOrder": {"part": "123", "title": "another amens", "section": "12312312"}, "authorizationId": "05fd82eb-8f77-f3f0-4a11-44ebaa07feb9", "authorizationType": "publiclaw"}, {"active": false, "version": 2, "publicLaw": {"lawNumber": 123, "congressCode": "2312"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}, {"active": true, "version": 3, "publicLaw": {"lawNumber": 123, "congressCode": "1231231"}, "authorizationId": "f03d922c-ce31-c557-8ebb-1610a1aae675", "authorizationType": "publiclaw"}], "alternativeNames": ["pop name"]}}');
            var program = programsSvc.get({id: "testID"});
            $httpBackend.flush();
            expect(program._id).toBeDefined();
            expect(program._id).toBe("bde3daabaf5f41ea986e6b421f78");
        });
    });

    describe("Testing for list of Programs retrieval", function() {
        it('should make a get call to retrieve list of programs', function() {
            $httpBackend
                .whenGET('/api/programs')
                .respond('{"results":[{"id": "e42b83cefdf94ff99c9677adb708", "data":{"_id": "e42b83cefdf94ff99c9677adb708", "title": "0000000000000Some title011111111111111111", "agencyId": "REI Test Agency", "projects": {"flag": "yes"}, "relatedTo": [], "projectsArray": []}},{"id":"6bb682cde63b48ae9c3fe448ac32", "data":{"_id": "6bb682cde63b48ae9c3fe448ac32", "title": "0000000000000Some title3", "agencyId": "REI Test Agency", "projects": {"flag": "yes"}, "relatedTo": [], "application": {"deadlines": {"approval": {"interval": "1"}}}, "projectsArray": []}}],"totalCount":0,"offset":0,"limit":2}');
            var programs = programsSvc.query();
            $httpBackend.flush();
            expect(programs).toBeDefined();
            expect(programs.length).toBe(2);
        });

        it('should populate _id field for all programs missing it', function() {
            $httpBackend
                .whenGET('/api/programs')
                .respond('{"results":[{"id": "e42b83cefdf94ff99c9677adb708", "data":{"_id": "e42b83cefdf94ff99c9677adb708", "title": "0000000000000Some title011111111111111111", "agencyId": "REI Test Agency", "projects": {"flag": "yes"}, "relatedTo": [], "projectsArray": []}},{"id":"6bb682cde63b48ae9c3fe448ac32", "data":{"_id":"6bb682cde63b48ae9c3fe448ac32", "title": "0000000000000Some title3", "agencyId": "REI Test Agency", "projects": {"flag": "yes"}, "relatedTo": [], "application": {"deadlines": {"approval": {"interval": "1"}}}, "projectsArray": []}}],"totalCount":0,"offset":0,"limit":2}');
            var programs = programsSvc.query();
            $httpBackend.flush();
            angular.forEach(programs, function (program) {
                expect(program.data._id).toBeDefined();
                expect(program.id).toBeDefined();
            });
        });
    });

    describe("Testing for create Program", function() {
        it('should make a post call to create program', function() {
            $httpBackend
                .whenPOST('/api/programs')
                .respond('testID');
            var response = programsSvc.save();
            $httpBackend.flush();
            expect(response).toBeDefined();
            expect(response._id).toBe("testID");
        });
    });

    describe("Testing for update Program", function() {
        it('should make a patch call to create program', function() {
            $httpBackend
                .whenPATCH('/api/programs')
                .respond('testID');
            var response = programsSvc.update({id: "testID"});
            $httpBackend.flush();
            expect(response).toBeDefined();
            expect(response._id).toBe("testID");
        });
    });
});
