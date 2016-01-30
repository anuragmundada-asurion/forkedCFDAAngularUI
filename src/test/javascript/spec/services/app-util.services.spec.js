'use strict';

describe("Unit Tests for App Utility Service", function () {
    var appUtilSvc;

    beforeEach(function() {
        module('app');

        inject(function(_appUtil_){
            appUtilSvc = _appUtil_;
        });
    });

    describe("Unit Tests for Get Authorization Title", function() {
        describe("Unit Tests for Act Authorization Type", function() {
            it('should get authorization title with defined description, title, part, and section', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "act": {
                        "title": "TestTitle",
                        "part": "TestPart",
                        "description": "TestDesc",
                        "section": "TestSection"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "act"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("TestDesc,Title TestTitle,Part TestPart,Section TestSection");
            });

            it('should get authorization title with undefined description', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "act": {
                        "title": "TestTitle",
                        "part": "TestPart",
                        "section": "TestSection"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "act"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe(",Title TestTitle,Part TestPart,Section TestSection");
            });

            it('should get authorization title with undefined title', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "act": {
                        "part": "TestPart",
                        "description": "TestDesc",
                        "section": "TestSection"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "act"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("TestDesc,Title ,Part TestPart,Section TestSection");
            });

            it('should get authorization title with undefined part', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "act": {
                        "title": "TestTitle",
                        "description": "TestDesc",
                        "section": "TestSection"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "act"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("TestDesc,Title TestTitle,Part ,Section TestSection");
            });

            it('should get authorization title with undefined section', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "act": {
                        "title": "TestTitle",
                        "part": "TestPart",
                        "description": "TestDesc"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "act"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("TestDesc,Title TestTitle,Part TestPart,Section ");
            });
        });

        describe("Unit Tests for Public Law Authorization Type", function() {
            it('should get authorization title with defined congress code and law number', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "publicLaw": {
                        "congressCode": "TestCode",
                        "lawNumber": "TestNumber"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "publiclaw"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Public Law TestCode-TestNumber");
            });

            it('should get authorization title with undefined congress code', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "publicLaw": {
                        "lawNumber": "TestNumber"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "publiclaw"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Public Law -TestNumber");
            });

            it('should get authorization title with undefined law number', function(){
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "publicLaw": {
                        "congressCode": "TestCode"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "publiclaw"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Public Law TestCode-");
            });
        });

        describe("Unit Tests for Statute Authorization Type", function() {
            it('should get authorization title with defined volume and page', function () {
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "statute": {
                        "volume": "TestVolume",
                        "page": "TestPage"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "statute"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Statute TestVolume-TestPage");
            });

            it('should get authorization title with undefined volume', function () {
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "statute": {
                        "page": "TestPage"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "statute"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Statute -TestPage");
            });

            it('should get authorization title with undefined page', function () {
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "statute": {
                        "volume": "TestVolume"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "statute"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Statute TestVolume-");
            });
        });

        describe("Unit Tests for USC Authorization Type", function() {
            it('should get authorization title with defined title and section', function () {
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "USC": {
                        "title": "TestTitle",
                        "section": "TestSection"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "usc"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("TestTitle US Code TestSection");
            });

            it('should get authorization title with undefined title', function () {

                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "USC": {
                        "section": "TestSection"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "usc"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe(" US Code TestSection");
            });

            it('should get authorization title with undefined section', function () {

                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "USC": {
                        "title": "TestTitle"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "usc"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("TestTitle US Code ");
            });
        });

        describe("Unit Tests for Executive Order Authorization Type", function() {
            it('should get authorization title with defined title', function () {
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "executiveOrder": {
                        "title": "TestTitle"
                    },
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "eo"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Executive Order - TestTitle");
            });

            it('should get authorization title with undefined title', function () {
                var authorizationTitle = appUtilSvc.getAuthorizationTitle({
                    "executiveOrder": {},
                    "version": 1,
                    "authorizationId": "TestId",
                    "authorizationType": "eo"
                });
                expect(authorizationTitle).toBeDefined();
                expect(authorizationTitle).toBe("Executive Order - ");
            });
        });
    });

    describe("Unit Tests for Get Account Title", function() {
        it('should get account title with defined code and description', function(){
            var authorizationTitle = appUtilSvc.getAccountTitle({
                "code": "TestCode",
                "description": "TestDescription"
            });
            expect(authorizationTitle).toBeDefined();
            expect(authorizationTitle).toBe("TestCode-TestDescription");
        });

        it('should get authorization title with undefined code', function(){
            var authorizationTitle = appUtilSvc.getAccountTitle({
                "description": "TestDescription"
            });
            expect(authorizationTitle).toBeDefined();
            expect(authorizationTitle).toBe("-TestDescription");
        });

        it('should get authorization title with undefined description', function(){
            var authorizationTitle = appUtilSvc.getAccountTitle({
                "code": "TestCode"
            });
            expect(authorizationTitle).toBeDefined();
            expect(authorizationTitle).toBe("TestCode-");
        });
    });

    describe("Unit Tests for Get Obligation Title", function() {
        it('should get obligation title with a lot of values', function(){
            var obligationTitle = appUtilSvc.getObligationTitle({
                "values": {
                    "2014": {
                        "flag": "yes",
                        "actual": 100000,
                        "estimate": 10000
                    },
                    "2015": {
                        "flag": "no",
                        "estimate": 10000
                    },
                    "2016": {
                        "flag": "na",
                        "estimate": 10000
                    }
                },
                "questions": {
                    "recovery": {
                        "flag": "yes"
                    },
                    "salary_or_expense": {
                        "flag": "yes",
                        "assistanceType": "0003001"
                    }
                },
                "additionalInfo": {
                    "content": "TestContent"
                }
            });
            expect(obligationTitle).toBeDefined();
            expect(obligationTitle).toBe('FY14 (actual): 100000 (est): 10000. FY15: Not separately identifiable. FY16: Not available. This is a Recovery and Reinvestment Act obligation. This obligation is for salaries and expenses. TestContent ');
        });

        it('should get obligation title with minimal values', function(){
            var obligationTitle = appUtilSvc.getObligationTitle({
                "values": {
                    "2014": {
                        "flag": "yes"
                    },
                    "2015": {
                        "flag": "no"
                    },
                    "2016": {}
                },
                "questions": {},
                "additionalInfo": {}
            });
            expect(obligationTitle).toBeDefined();
            expect(obligationTitle).toBe('FY14. FY15: Not separately identifiable. FY16');
        });
    });

    describe("Unit Tests for Get Deadline Title", function() {
        var deadlineStartDateString = "Jan 30, 2013",
            deadlineEndDateString = "May 10, 2013",
            description = "A simple test description",
            deadlineStartDate = new Date(deadlineStartDateString),
            deadlineEndDate = new Date(deadlineEndDateString);

        it('should get deadline title with defined start and end date only', function(){
            var deadlineTitle = appUtilSvc.getDeadlineTitle({
                start: deadlineStartDate,
                end: deadlineEndDate
            }),
                expectResult = expect(deadlineTitle);

            expectResult.toBeDefined();
            expectResult.toBe(deadlineStartDateString + " - " + deadlineEndDateString);
        });

        it('should get deadline title with defined start date and description only', function(){
            var deadlineTitle = appUtilSvc.getDeadlineTitle({
                    start: deadlineStartDate,
                    description: description
                }),
                expectResult = expect(deadlineTitle);

            expectResult.toBeDefined();
            expectResult.toBe(deadlineStartDateString + ". " + description);
        });

        it('should get deadline title with defined start date, end date, and description only', function(){
            var deadlineTitle = appUtilSvc.getDeadlineTitle({
                    start: deadlineStartDate,
                    end: deadlineEndDate,
                    description: description
                }),
                expectResult = expect(deadlineTitle);

            expectResult.toBeDefined();
            expectResult.toBe(deadlineStartDateString + " - " + deadlineEndDateString + ". " + description);
        });

        it('should get deadline title with defined description only', function(){
            var deadlineTitle = appUtilSvc.getDeadlineTitle({
                    description: description
                }),
                expectResult = expect(deadlineTitle);

            expectResult.toBeDefined();
            expectResult.toBe(description);
        });

        it('should get a default empty title if deadline is empty', function(){
            var deadlineTitle = appUtilSvc.getDeadlineTitle({}),
                expectResult = expect(deadlineTitle);

            expectResult.toBeDefined();
            expectResult.toBe('(no title)');
        });
    });

    describe("Unit Tests for Get Tafs Title", function() {
        it('should get get tafs title with defined account code and department code', function(){
            var tafsTitle = appUtilSvc.getTafsTitle({
                "accountCode": "TestCode",
                "departmentCode": "TestCode"
            });
            expect(tafsTitle).toBeDefined();
            expect(tafsTitle).toBe("TestCode-TestCode");
        });

        it('should get get tafs title with undefined department code', function(){
            var tafsTitle = appUtilSvc.getTafsTitle({
                "accountCode": "TestCode"
            });
            expect(tafsTitle).toBeDefined();
            expect(tafsTitle).toBe("-TestCode");
        });

        it('should get get tafs title with undefined account code', function(){
            var tafsTitle = appUtilSvc.getTafsTitle({
                "departmentCode": "TestCode"
            });
            expect(tafsTitle).toBeDefined();
            expect(tafsTitle).toBe("TestCode-");
        });
    });

    describe("Unit Tests for Contact Title", function() {
        it('should get get contact title with defined title and full name', function(){
            var contactTitle = appUtilSvc.getContactTitle({
                "title": "TestTitle",
                "fullName": "TestFullName"
            });
            expect(contactTitle).toBeDefined();
            expect(contactTitle).toBe("TestTitle TestFullName");
        });

        it('should get get contact title with undefined title', function(){
            var contactTitle = appUtilSvc.getContactTitle({
                "fullName": "TestFullName"
            });
            expect(contactTitle).toBeDefined();
            expect(contactTitle).toBe("TestFullName");
        });

        it('should get get contact title with undefined full name', function(){
            var contactTitle = appUtilSvc.getContactTitle({
                "title": "TestTitle"
            });
            expect(contactTitle).toBeDefined();
            expect(contactTitle).toBe("TestTitle ");
        });
    });
});